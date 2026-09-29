import { ConfigService } from '@nestjs/config';
export interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare class MailService {
    private config;
    private readonly logger;
    private transporter;
    private readonly fromAddress;
    constructor(config: ConfigService);
    sendMail(options: SendMailOptions): Promise<boolean>;
}
