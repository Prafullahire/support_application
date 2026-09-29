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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../common/enums");
const roles_constants_1 = require("../common/constants/roles.constants");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(userId, role, branchId) {
        const branchFilter = branchId ? { branchId } : {};
        const isAdmin = (0, roles_constants_1.isPrivilegedAdmin)(role);
        const userFilter = isAdmin ? {} : { createdById: userId };
        const [totalRequests, pendingRequests, completedRequests, totalAssets, availableAssets, expenseAgg, expiringAmc, lowStockJoiningKit, lowStockBrochures, unreadNotifications,] = await Promise.all([
            this.prisma.request.count({ where: { ...branchFilter, ...userFilter } }),
            this.prisma.request.count({
                where: {
                    ...branchFilter,
                    ...userFilter,
                    status: {
                        in: [
                            enums_1.RequestStatus.SUBMITTED,
                            enums_1.RequestStatus.UNDER_REVIEW,
                            enums_1.RequestStatus.IN_PROGRESS,
                        ],
                    },
                },
            }),
            this.prisma.request.count({
                where: {
                    ...branchFilter,
                    ...userFilter,
                    status: enums_1.RequestStatus.COMPLETED,
                },
            }),
            this.prisma.asset.count({ where: branchFilter }),
            this.prisma.asset.count({
                where: { ...branchFilter, status: enums_1.AssetStatus.AVAILABLE },
            }),
            this.prisma.expense.aggregate({
                where: { ...branchFilter, ...userFilter },
                _sum: { amount: true },
            }),
            this.prisma.amcRecord.count({
                where: {
                    ...branchFilter,
                    status: enums_1.AmcStatus.ACTIVE,
                    endDate: {
                        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        gte: new Date(),
                    },
                },
            }),
            this.getLowStockJoiningKitCount(branchFilter),
            this.getLowStockBrochureCount(branchFilter),
            this.prisma.notification.count({
                where: isAdmin ? { isRead: false } : { userId, isRead: false },
            }),
        ]);
        return {
            role,
            totalRequests,
            pendingRequests,
            completedRequests,
            totalAssets,
            availableAssets,
            totalExpenses: Number(expenseAgg._sum.amount || 0),
            expiringAmc,
            lowStockItems: lowStockJoiningKit + lowStockBrochures,
            unreadNotifications,
        };
    }
    async getLowStockJoiningKitCount(branchFilter) {
        const stocks = await this.prisma.joiningKitStock.findMany({ where: branchFilter });
        return stocks.filter((s) => s.quantity <= s.minStock).length;
    }
    async getLowStockBrochureCount(branchFilter) {
        const stocks = await this.prisma.brochureStock.findMany({ where: branchFilter });
        return stocks.filter((s) => s.quantity <= s.minStock).length;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map