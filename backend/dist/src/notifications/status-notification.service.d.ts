import { ConfigService } from '@nestjs/config';
import { NotificationType } from '../common/enums';
import { AuditService } from '../common/services/base.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
export interface StatusChangePayload {
    module: string;
    recordId: string;
    recordTitle: string;
    oldStatus?: string;
    newStatus: string;
    updatedByUserId: string;
    recipientUserIds: string[];
    notificationType?: NotificationType;
    link?: string;
}
export declare class StatusNotificationService {
    private prisma;
    private notificationsService;
    private mailService;
    private auditService;
    private config;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, mailService: MailService, auditService: AuditService, config: ConfigService);
    notifyStatusChange(payload: StatusChangePayload): Promise<void>;
    private formatStatus;
    private buildEmailHtml;
}
