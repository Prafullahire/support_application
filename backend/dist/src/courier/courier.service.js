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
exports.CourierService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const enums_1 = require("../common/enums");
const roles_constants_1 = require("../common/constants/roles.constants");
const prisma_service_1 = require("../prisma/prisma.service");
const status_notification_service_1 = require("../notifications/status-notification.service");
let CourierService = class CourierService {
    constructor(prisma, statusNotification, config) {
        this.prisma = prisma;
        this.statusNotification = statusNotification;
        this.config = config;
    }
    findAll(userId, role, branchId) {
        const where = (0, roles_constants_1.isPrivilegedAdmin)(role)
            ? { ...(branchId ? { branchId } : {}) }
            : { createdById: userId };
        return this.prisma.courierRequest.findMany({
            where,
            include: this.include(),
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId, role) {
        const record = await this.prisma.courierRequest.findUnique({
            where: { id },
            include: this.include(),
        });
        if (!record)
            throw new common_1.NotFoundException('Courier request not found');
        if (!(0, roles_constants_1.isPrivilegedAdmin)(role) && record.createdById !== userId) {
            throw new common_1.NotFoundException('Courier request not found');
        }
        return record;
    }
    create(dto, userId) {
        const requestNumber = `CR-${Date.now()}`;
        return this.prisma.courierRequest.create({
            data: {
                ...dto,
                requestNumber,
                createdById: userId,
                pickupDate: dto.pickupDate ? new Date(dto.pickupDate) : undefined,
            },
            include: this.include(),
        });
    }
    async update(id, dto, userId, role) {
        await this.findOne(id, userId, role);
        return this.prisma.courierRequest.update({
            where: { id },
            data: {
                ...dto,
                pickupDate: dto.pickupDate ? new Date(dto.pickupDate) : undefined,
                deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : undefined,
            },
            include: this.include(),
        });
    }
    async updateStatus(id, dto, userId, role) {
        const existing = await this.findOne(id, userId, role);
        const updated = await this.prisma.courierRequest.update({
            where: { id },
            data: {
                status: dto.status,
                trackingNumber: dto.trackingNumber,
                deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : undefined,
            },
            include: this.include(),
        });
        if ((0, roles_constants_1.isPrivilegedAdmin)(role) && dto.status !== existing.status) {
            await this.notifyCourierStatusChange(existing, dto.status, userId, id);
        }
        return updated;
    }
    async remove(id, userId, role) {
        await this.findOne(id, userId, role);
        return this.prisma.courierRequest.delete({ where: { id } });
    }
    async notifyCourierStatusChange(existing, newStatus, userId, id) {
        const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3000';
        await this.statusNotification.notifyStatusChange({
            module: 'Courier',
            recordId: id,
            recordTitle: existing.requestNumber,
            oldStatus: existing.status,
            newStatus,
            updatedByUserId: userId,
            recipientUserIds: [existing.createdById],
            notificationType: enums_1.NotificationType.COURIER_DELIVERY,
            link: `${frontendUrl}/courier`,
        });
    }
    include() {
        return {
            vendor: { select: { id: true, name: true } },
            branch: { select: { id: true, name: true } },
            createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        };
    }
};
exports.CourierService = CourierService;
exports.CourierService = CourierService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        status_notification_service_1.StatusNotificationService,
        config_1.ConfigService])
], CourierService);
//# sourceMappingURL=courier.service.js.map