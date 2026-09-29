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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusNotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const enums_1 = require("../common/enums");
const base_service_1 = require("../common/services/base.service");
const mail_service_1 = require("../mail/mail.service");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("./notifications.service");
let StatusNotificationService = class StatusNotificationService {
    constructor(prisma, notificationsService, mailService, auditService, config) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.mailService = mailService;
        this.auditService = auditService;
        this.config = config;
    }
    async notifyStatusChange(payload) {
        const { module, recordId, recordTitle, oldStatus, newStatus, updatedByUserId, recipientUserIds, notificationType = enums_1.NotificationType.REQUEST_UPDATED, link, } = payload;
        if (oldStatus && oldStatus === newStatus)
            return;
        const uniqueRecipientIds = [...new Set(recipientUserIds.filter((id) => id && id !== updatedByUserId))];
        if (uniqueRecipientIds.length === 0)
            return;
        const [updater, recipients] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: updatedByUserId },
                select: { firstName: true, lastName: true, email: true },
            }),
            this.prisma.user.findMany({
                where: { id: { in: uniqueRecipientIds }, isActive: true },
                select: { id: true, firstName: true, lastName: true, email: true },
            }),
        ]);
        const updaterName = updater ? `${updater.firstName} ${updater.lastName}` : 'Admin';
        const title = `${module} status updated`;
        const message = oldStatus
            ? `"${recordTitle}" status changed from ${this.formatStatus(oldStatus)} to ${this.formatStatus(newStatus)} by ${updaterName}.`
            : `"${recordTitle}" status set to ${this.formatStatus(newStatus)} by ${updaterName}.`;
        const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3000';
        const recordLink = link || `${frontendUrl}/${module.toLowerCase()}`;
        await Promise.all(recipients.map(async (recipient) => {
            await this.notificationsService.create({
                userId: recipient.id,
                title,
                message,
                type: notificationType,
                link: recordLink,
            });
            if (recipient.email) {
                await this.mailService.sendMail({
                    to: recipient.email,
                    subject: `[Support App] ${title}`,
                    html: this.buildEmailHtml({
                        recipientName: recipient.firstName,
                        module,
                        recordTitle,
                        oldStatus,
                        newStatus,
                        updaterName,
                        recordLink,
                    }),
                    text: `Hi ${recipient.firstName},\n\n${message}\n\nView details: ${recordLink}`,
                });
            }
        }));
        await this.auditService.log(updatedByUserId, 'STATUS_CHANGE', module, recordId, JSON.stringify({ oldStatus, newStatus, notifiedUsers: recipients.map((r) => r.id) }));
    }
    formatStatus(status) {
        return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    }
    buildEmailHtml(params) {
        const statusLine = params.oldStatus
            ? `<p><strong>Previous status:</strong> ${this.formatStatus(params.oldStatus)}</p>
         <p><strong>New status:</strong> ${this.formatStatus(params.newStatus)}</p>`
            : `<p><strong>Status:</strong> ${this.formatStatus(params.newStatus)}</p>`;
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0A0A0A; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Support Team Management</h2>
        </div>
        <div style="border: 1px solid #e5e5e5; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
          <p>Hi ${params.recipientName},</p>
          <p>An admin has updated the status of your ${params.module.toLowerCase()} record.</p>
          <p><strong>Title:</strong> ${params.recordTitle}</p>
          ${statusLine}
          <p><strong>Updated by:</strong> ${params.updaterName}</p>
          <a href="${params.recordLink}" style="display: inline-block; margin-top: 16px; background: #DC2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View Details</a>
        </div>
      </div>
    `;
    }
};
exports.StatusNotificationService = StatusNotificationService;
exports.StatusNotificationService = StatusNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        mail_service_1.MailService,
        base_service_1.AuditService,
        config_1.ConfigService])
], StatusNotificationService);
//# sourceMappingURL=status-notification.service.js.map