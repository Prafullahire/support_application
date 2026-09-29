"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../common/enums");
const XLSX = __importStar(require("xlsx"));
const query_util_1 = require("../common/utils/query.util");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(query) {
        const branchFilter = (0, query_util_1.isValidQueryValue)(query.branchId) ? { branchId: query.branchId } : {};
        const entityFilter = (0, query_util_1.isValidQueryValue)(query.entityId) ? { entityId: query.entityId } : {};
        const expenseFilter = { ...branchFilter, ...entityFilter };
        const dateFilter = (0, query_util_1.buildExpenseDateFilter)(query.startDate, query.endDate);
        const now = new Date();
        const thirtyDays = new Date();
        thirtyDays.setDate(thirtyDays.getDate() + 30);
        const [totalRequests, pendingRequests, totalAssets, assignedAssets, totalExpenses, expiringAmc, activePg, lowStockJoiningKit, lowStockBrochures, expenseSummary,] = await Promise.all([
            this.prisma.request.count({ where: branchFilter }),
            this.prisma.request.count({
                where: {
                    ...branchFilter,
                    status: { in: [enums_1.RequestStatus.SUBMITTED, enums_1.RequestStatus.UNDER_REVIEW, enums_1.RequestStatus.IN_PROGRESS] },
                },
            }),
            this.prisma.asset.count({ where: branchFilter }),
            this.prisma.asset.count({ where: { ...branchFilter, status: enums_1.AssetStatus.ASSIGNED } }),
            this.prisma.expense.aggregate({
                where: { ...expenseFilter, ...dateFilter },
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.amcRecord.count({
                where: {
                    ...branchFilter,
                    status: enums_1.AmcStatus.ACTIVE,
                    endDate: { lte: thirtyDays, gte: now },
                },
            }),
            this.prisma.pgRecord.count({
                where: { ...branchFilter, status: enums_1.PgStatus.ACTIVE },
            }),
            this.prisma.joiningKitStock.findMany({ where: branchFilter }).then((items) => items.filter((s) => s.quantity <= s.minStock).length),
            this.prisma.brochureStock.findMany({ where: branchFilter }).then((items) => items.filter((s) => s.quantity <= s.minStock).length),
            this.getExpenseSummary(query),
        ]);
        return {
            requests: { total: totalRequests, pending: pendingRequests },
            assets: { total: totalAssets, assigned: assignedAssets },
            expenses: {
                totalAmount: totalExpenses._sum.amount ?? 0,
                count: totalExpenses._count,
            },
            expenseSummary,
            amc: { expiringSoon: expiringAmc },
            pg: { active: activePg },
            stock: { lowJoiningKit: lowStockJoiningKit, lowBrochures: lowStockBrochures },
        };
    }
    async getExpenseSummary(query) {
        const dateFilter = (0, query_util_1.buildExpenseDateFilter)(query.startDate, query.endDate);
        const where = {
            ...((0, query_util_1.isValidQueryValue)(query.entityId) ? { entityId: query.entityId } : {}),
            ...((0, query_util_1.isValidQueryValue)(query.branchId) ? { branchId: query.branchId } : {}),
            ...dateFilter,
        };
        const [entities, branches, expenses] = await Promise.all([
            this.prisma.entity.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
            this.prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
            this.prisma.expense.findMany({
                where,
                select: { amount: true, entityId: true, branchId: true },
            }),
        ]);
        const entityWise = entities.map((entity) => {
            const entityExpenses = expenses.filter((e) => e.entityId === entity.id);
            const branchBreakdown = branches
                .map((branch) => {
                const branchExpenses = entityExpenses.filter((e) => e.branchId === branch.id);
                const total = branchExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
                return { branchId: branch.id, branchName: branch.name, total, count: branchExpenses.length };
            })
                .filter((b) => b.count > 0);
            return {
                entityId: entity.id,
                entityName: entity.name,
                total: entityExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
                count: entityExpenses.length,
                branches: branchBreakdown,
            };
        }).filter((e) => e.count > 0);
        const branchWise = branches
            .map((branch) => {
            const branchExpenses = expenses.filter((e) => e.branchId === branch.id);
            return {
                branchId: branch.id,
                branchName: branch.name,
                total: branchExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
                count: branchExpenses.length,
            };
        })
            .filter((b) => b.count > 0);
        return {
            grandTotal: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
            totalCount: expenses.length,
            entityWise,
            branchWise,
        };
    }
    async exportToExcel(module, query) {
        const branchFilter = (0, query_util_1.isValidQueryValue)(query.branchId) ? { branchId: query.branchId } : {};
        let data = [];
        switch (module) {
            case 'requests':
                data = await this.prisma.request.findMany({
                    where: branchFilter,
                    include: {
                        branch: { select: { name: true } },
                        createdBy: { select: { firstName: true, lastName: true } },
                    },
                });
                break;
            case 'assets':
                data = await this.prisma.asset.findMany({
                    where: branchFilter,
                    include: { category: { select: { name: true } }, branch: { select: { name: true } } },
                });
                break;
            case 'expenses':
                data = await this.prisma.expense.findMany({
                    where: {
                        ...((0, query_util_1.isValidQueryValue)(query.branchId) ? { branchId: query.branchId } : {}),
                        ...((0, query_util_1.isValidQueryValue)(query.entityId) ? { entityId: query.entityId } : {}),
                        ...(0, query_util_1.buildExpenseDateFilter)(query.startDate, query.endDate),
                    },
                    include: {
                        category: { select: { name: true } },
                        entity: { select: { name: true } },
                        branch: { select: { name: true } },
                    },
                });
                break;
            case 'vendors':
                data = await this.prisma.vendor.findMany();
                break;
            case 'amc':
                data = await this.prisma.amcRecord.findMany({
                    where: branchFilter,
                    include: { vendor: { select: { name: true } }, branch: { select: { name: true } } },
                });
                break;
            default:
                data = [];
        }
        const worksheet = XLSX.utils.json_to_sheet(data.map((row) => this.flattenRow(row)));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, module);
        return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
    }
    flattenRow(obj, prefix = '') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (value && typeof value === 'object' && !(value instanceof Date) && !Array.isArray(value)) {
                Object.assign(result, this.flattenRow(value, fullKey));
            }
            else if (value instanceof Date) {
                result[fullKey] = value.toISOString();
            }
            else if (typeof value !== 'object') {
                result[fullKey] = value;
            }
        }
        return result;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map