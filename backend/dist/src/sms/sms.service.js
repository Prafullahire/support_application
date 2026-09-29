"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const office_boy_util_1 = require("../common/utils/office-boy.util");
const TWILIO_TRIAL_SMS_TEMPLATES = new Set([
    'sms_2fa',
    'sms_appointment_reminders',
    'sms_order_confirmation',
    'sms_delivery_updates',
    'sms_customer_support',
    'sms_marketing_promotions',
    'sms_event_notifications',
    'sms_account_alerts',
    'sms_feedback_surveys',
    'sms_internal_alerts',
]);
let SmsService = SmsService_1 = class SmsService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(SmsService_1.name);
        this.accountSid = this.readEnv('TWILIO_ACCOUNT_SID');
        this.authToken = this.readEnv('TWILIO_AUTH_TOKEN');
        this.defaultCountryCode =
            this.readEnv('SMS_DEFAULT_COUNTRY_CODE') || '91';
        this.fromNumber = this.formatTwilioFromNumber(this.readEnv('TWILIO_PHONE_NUMBER'));
        this.trialMode = this.readEnv('TWILIO_TRIAL_MODE') === 'true';
        this.trialTemplate = this.resolveTrialTemplate(this.readEnv('TWILIO_TRIAL_SMS_TEMPLATE'));
        if (this.accountSid && this.authToken && this.fromNumber) {
            this.logger.log(`Twilio SMS transport configured (from: ${this.fromNumber})`);
            if (this.trialMode) {
                this.logger.warn(`Twilio trial mode enabled — SMS uses template "${this.trialTemplate}" (custom text is not sent until account is upgraded).`);
            }
        }
        else {
            const missing = [
                !this.accountSid && 'TWILIO_ACCOUNT_SID',
                !this.authToken && 'TWILIO_AUTH_TOKEN',
                !this.fromNumber && 'TWILIO_PHONE_NUMBER',
            ].filter(Boolean);
            this.logger.warn(`SMS not configured — missing: ${missing.join(', ') || 'unknown'}. Messages will be logged to console.`);
        }
    }
    readEnv(key) {
        const raw = this.config.get(key) ?? process.env[key];
        const value = raw?.trim().replace(/^["']|["']$/g, '');
        return value || undefined;
    }
    formatTwilioFromNumber(value) {
        if (!value)
            return undefined;
        const digits = (0, office_boy_util_1.normalizePhone)(value);
        if (!digits)
            return undefined;
        if (value.startsWith('+'))
            return value;
        if (digits.length === 10) {
            return `+${this.defaultCountryCode}${digits}`;
        }
        return `+${digits}`;
    }
    resolveTrialTemplate(value) {
        const template = value?.trim() || 'sms_account_alerts';
        if (!TWILIO_TRIAL_SMS_TEMPLATES.has(template)) {
            this.logger.warn(`Invalid TWILIO_TRIAL_SMS_TEMPLATE "${template}" — falling back to sms_account_alerts`);
            return 'sms_account_alerts';
        }
        return template;
    }
    isTrialTemplateError(errorText) {
        return (errorText.includes('572006') ||
            errorText.toLowerCase().includes('predefined sms templates'));
    }
    parseTwilioErrorCode(errorText) {
        try {
            const parsed = JSON.parse(errorText);
            return typeof parsed.code === 'number' ? parsed.code : undefined;
        }
        catch {
            return undefined;
        }
    }
    logTwilioFailure(status, errorText) {
        const code = this.parseTwilioErrorCode(errorText);
        if (code === 572003) {
            this.logger.error(`Twilio SMS failed (${status}, code ${code}): TWILIO_PHONE_NUMBER is wrong for a trial account. ` +
                'Use the Twilio trial sender from Console → Messaging → Try out SMS (not your personal mobile). ' +
                `Currently configured from: ${this.fromNumber}`);
            return;
        }
        if (code === 21608 || code === 21211) {
            this.logger.error(`Twilio SMS failed (${status}, code ${code}): Recipient is not verified. ` +
                'Trial accounts can only SMS verified numbers — add the number in Console → Phone Numbers → Verified Caller IDs.');
            return;
        }
        this.logger.error(`Twilio SMS failed (${status}): ${errorText}`);
    }
    async postTwilioMessage(recipient, body) {
        const payload = new URLSearchParams({
            To: recipient,
            From: this.fromNumber,
            Body: body,
        });
        return fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload,
        });
    }
    async sendSms(to, message) {
        const recipient = this.formatE164(to);
        if (!recipient || !message.trim())
            return false;
        if (!this.accountSid || !this.authToken || !this.fromNumber) {
            this.logger.log(`[DEV SMS] To: ${recipient}\n${message}`);
            return true;
        }
        const initialBody = this.trialMode ? this.trialTemplate : message;
        try {
            let response = await this.postTwilioMessage(recipient, initialBody);
            if (!response.ok) {
                const errorText = await response.text();
                if (!this.trialMode &&
                    initialBody !== this.trialTemplate &&
                    this.isTrialTemplateError(errorText)) {
                    this.logger.warn(`Twilio trial account detected — retrying with template "${this.trialTemplate}". ` +
                        'Upgrade your Twilio account to send custom welcome SMS text.');
                    response = await this.postTwilioMessage(recipient, this.trialTemplate);
                }
                else {
                    this.logTwilioFailure(response.status, errorText);
                    return false;
                }
            }
            if (!response.ok) {
                const errorText = await response.text();
                this.logTwilioFailure(response.status, errorText);
                return false;
            }
            this.logger.log(`SMS sent successfully to ${recipient}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send SMS to ${recipient}`, error);
            return false;
        }
    }
    formatE164(phone) {
        const digits = (0, office_boy_util_1.normalizePhone)(phone);
        if (!digits)
            return '';
        if (digits.length === 10) {
            return `+${this.defaultCountryCode}${digits}`;
        }
        if (digits.length === 12 && digits.startsWith(this.defaultCountryCode)) {
            return `+${digits}`;
        }
        return digits.startsWith('+') ? digits : `+${digits}`;
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map