import { ConfigService } from '@nestjs/config';
import { UserRole } from '../common/enums';
import { MailService } from '../mail/mail.service';
import { SmsService } from '../sms/sms.service';
type WelcomeUser = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    role: UserRole;
};
export declare class UserWelcomeNotificationService {
    private config;
    private mailService;
    private smsService;
    private readonly logger;
    constructor(config: ConfigService, mailService: MailService, smsService: SmsService);
    sendWelcomeNotifications(user: WelcomeUser): Promise<{
        smsSent: boolean;
        emailSent: boolean;
    }>;
    private getLoginUrl;
}
export {};
