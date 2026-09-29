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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../common/enums");
const roles_constants_1 = require("../common/constants/roles.constants");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const status_notification_service_1 = require("../notifications/status-notification.service");
let RequestsService = class RequestsService {
    constructor(prisma, statusNotification, config) {
        this.prisma = prisma;
        this.statusNotification = statusNotification;
        this.config = config;
    }
    findAll(userId, role, branchId) {
        const where = (0, roles_constants_1.isPrivilegedAdmin)(role)
            ? { ...(branchId ? { branchId } : {}) }
            : { createdById: userId };
        return this.prisma.request.findMany({
            where,
            include: this.include(),
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId, role) {
        const request = await this.prisma.request.findUnique({
            where: { id },
            include: this.include(),
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        if (!(0, roles_constants_1.isPrivilegedAdmin)(role) && request.createdById !== userId) {
            throw new common_1.NotFoundException('Request not found');
        }
        return request;
    }
    create(dto, userId) {
        return this.prisma.request.create({
            data: { ...dto, createdById: userId },
            include: this.include(),
        });
    }
    async update(id, dto, userId, role) {
        const existing = await this.findOne(id, userId, role);
        const updated = await this.prisma.request.update({
            where: { id },
            data: dto,
            include: this.include(),
        });
        if ((0, roles_constants_1.isPrivilegedAdmin)(role)) {
            const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3000';
            const recipientIds = [existing.createdById];
            if (existing.assignedToId)
                recipientIds.push(existing.assignedToId);
            if (dto.assignedToId && !recipientIds.includes(dto.assignedToId)) {
                recipientIds.push(dto.assignedToId);
            }
            if (dto.status && dto.status !== existing.status) {
                await this.statusNotification.notifyStatusChange({
                    module: 'Request',
                    recordId: id,
                    recordTitle: updated.title,
                    oldStatus: existing.status,
                    newStatus: dto.status,
                    updatedByUserId: userId,
                    recipientUserIds: recipientIds,
                    notificationType: dto.status === 'COMPLETED'
                        ? enums_1.NotificationType.REQUEST_COMPLETED
                        : enums_1.NotificationType.REQUEST_UPDATED,
                    link: `${frontendUrl}/requests`,
                });
            }
            else if (dto.assignedToId && dto.assignedToId !== existing.assignedToId) {
                await this.statusNotification.notifyStatusChange({
                    module: 'Request',
                    recordId: id,
                    recordTitle: updated.title,
                    newStatus: `Assigned to ${updated.assignedTo?.firstName || 'team member'}`,
                    updatedByUserId: userId,
                    recipientUserIds: [dto.assignedToId],
                    notificationType: enums_1.NotificationType.REQUEST_UPDATED,
                    link: `${frontendUrl}/requests`,
                });
            }
        }
        return updated;
    }
    async remove(id, userId, role) {
        await this.findOne(id, userId, role);
        return this.prisma.request.delete({ where: { id } });
    }
    include() {
        return {
            branch: { select: { id: true, name: true } },
            createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
            assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        };
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        status_notification_service_1.StatusNotificationService,
        config_1.ConfigService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map