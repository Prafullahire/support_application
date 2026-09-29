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
var UserWelcomeNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWelcomeNotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const enums_1 = require("../common/enums");
const mail_service_1 = require("../mail/mail.service");
const sms_service_1 = require("../sms/sms.service");
const contact_util_1 = require("../common/utils/contact.util");
let UserWelcomeNotificationService = UserWelcomeNotificationService_1 = class UserWelcomeNotificationService {
    constructor(config, mailService, smsService) {
        this.config = config;
        this.mailService = mailService;
        this.smsService = smsService;
        this.logger = new common_1.Logger(UserWelcomeNotificationService_1.name);
    }
    async sendWelcomeNotifications(user) {
        const loginUrl = this.getLoginUrl();
        const loginId = user.role === enums_1.UserRole.OFFICE_BOY && user.phone ? user.phone : user.email;
        const result = { smsSent: false, emailSent: false };
        if (user.phone?.trim()) {
            const smsMessage = `Hello ${user.firstName}, your Support App account is ready.\n` +
                `Login: ${loginUrl}\n` +
                `Use ${loginId} and your password to sign in.`;
            result.smsSent = await this.smsService.sendSms(user.phone, smsMessage);
            if (!result.smsSent) {
                this.logger.warn(`Welcome SMS could not be sent for user ${user.email}`);
            }
        }
        if (user.email && !(0, contact_util_1.isSystemGeneratedEmail)(user.email)) {
            result.emailSent = await this.mailService.sendMail({
                to: user.email,
                subject: 'Your Support App account is ready',
                text: `Hello ${user.firstName},\n\n` +
                    `Your account has been created on Support App.\n\n` +
                    `Login here: ${loginUrl}\n` +
                    `Sign in with: ${loginId}\n\n` +
                    `Use the password set by your administrator.`,
                html: `<p>Hello ${user.firstName},</p>` +
                    `<p>Your account has been created on <strong>Support App</strong>.</p>` +
                    `<p><a href="${loginUrl}">Click here to login</a></p>` +
                    `<p>Sign in with: <strong>${loginId}</strong></p>` +
                    `<p>Use the password set by your administrator.</p>`,
            });
        }
        return result;
    }
    getLoginUrl() {
        const frontendUrl = (this.config.get('FRONTEND_URL') || 'http://localhost:3000').replace(/\/$/, '');
        return `${frontendUrl}/login`;
    }
};
exports.UserWelcomeNotificationService = UserWelcomeNotificationService;
exports.UserWelcomeNotificationService = UserWelcomeNotificationService = UserWelcomeNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mail_service_1.MailService,
        sms_service_1.SmsService])
], UserWelcomeNotificationService);
//# sourceMappingURL=user-welcome-notification.service.js.map