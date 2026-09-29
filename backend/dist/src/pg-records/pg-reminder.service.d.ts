import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class PgReminderService {
    private prisma;
    private mail;
    private readonly logger;
    constructor(prisma: PrismaService, mail: MailService);
    sendExpiryReminders(): Promise<void>;
}
