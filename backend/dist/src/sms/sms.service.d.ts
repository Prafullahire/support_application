import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private config;
    private readonly logger;
    private readonly accountSid;
    private readonly authToken;
    private readonly fromNumber;
    private readonly defaultCountryCode;
    private readonly trialMode;
    private readonly trialTemplate;
    constructor(config: ConfigService);
    private readEnv;
    private formatTwilioFromNumber;
    private resolveTrialTemplate;
    private isTrialTemplateError;
    private parseTwilioErrorCode;
    private logTwilioFailure;
    private postTwilioMessage;
    sendSms(to: string, message: string): Promise<boolean>;
    private formatE164;
}
