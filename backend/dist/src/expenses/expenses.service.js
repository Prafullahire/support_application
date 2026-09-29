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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const roles_constants_1 = require("../common/constants/roles.constants");
const branch_scope_util_1 = require("../common/utils/branch-scope.util");
const query_util_1 = require("../common/utils/query.util");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpensesService = class ExpensesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(user, filters = {}) {
        const scope = (0, branch_scope_util_1.resolveBranchFilter)(user, filters.branchId);
        const where = {
            ...((0, roles_constants_1.isPrivilegedAdmin)(user.role)
                ? scope.branchId
                    ? { branchId: scope.branchId }
                    : {}
                : { createdById: user.id }),
            ...((0, query_util_1.isValidQueryValue)(filters.entityId) ? { entityId: filters.entityId } : {}),
            ...((0, query_util_1.isValidQueryValue)(filters.categoryId) ? { categoryId: filters.categoryId } : {}),
            ...(0, query_util_1.buildExpenseDateFilter)(filters.startDate, filters.endDate),
        };
        const sortBy = filters.sortBy || 'expenseDate';
        const sortOrder = filters.sortOrder || 'desc';
        return this.prisma.expense.findMany({
            where,
            include: this.include(),
            orderBy: { [sortBy]: sortOrder },
        });
    }
    async getSummary(user, filters = {}) {
        const scope = (0, branch_scope_util_1.resolveBranchFilter)(user, filters.branchId);
        const baseWhere = {
            ...((0, roles_constants_1.isPrivilegedAdmin)(user.role)
                ? scope.branchId
                    ? { branchId: scope.branchId }
                    : {}
                : { createdById: user.id }),
            ...((0, query_util_1.isValidQueryValue)(filters.entityId) ? { entityId: filters.entityId } : {}),
            ...(0, query_util_1.buildExpenseDateFilter)(filters.startDate, filters.endDate),
        };
        const branchWhere = scope.branchId ? { id: scope.branchId } : {};
        const [entities, branches, expenses] = await Promise.all([
            this.prisma.entity.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
            this.prisma.branch.findMany({
                where: { isActive: true, ...branchWhere },
                orderBy: { name: 'asc' },
            }),
            this.prisma.expense.findMany({
                where: baseWhere,
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
            const total = entityExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
            return {
                entityId: entity.id,
                entityName: entity.name,
                total,
                count: entityExpenses.length,
                branches: branchBreakdown,
            };
        });
        const branchWise = branches.map((branch) => {
            const branchExpenses = expenses.filter((e) => e.branchId === branch.id);
            const total = branchExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
            return {
                branchId: branch.id,
                branchName: branch.name,
                total,
                count: branchExpenses.length,
            };
        }).filter((b) => b.count > 0);
        const grandTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        return {
            grandTotal,
            totalCount: expenses.length,
            entityWise: entityWise.filter((e) => e.count > 0),
            branchWise,
            allEntities: entities,
            allBranches: branches,
        };
    }
    async findOne(id, userId, role) {
        const expense = await this.prisma.expense.findUnique({
            where: { id },
            include: this.include(),
        });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        if (!(0, roles_constants_1.isPrivilegedAdmin)(role) && expense.createdById !== userId) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return expense;
    }
    create(dto, userId) {
        return this.prisma.expense.create({
            data: {
                ...dto,
                amount: dto.amount,
                expenseDate: new Date(dto.expenseDate),
                createdById: userId,
            },
            include: this.include(),
        });
    }
    async update(id, dto, userId, role) {
        await this.findOne(id, userId, role);
        return this.prisma.expense.update({
            where: { id },
            data: {
                ...dto,
                expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : undefined,
            },
            include: this.include(),
        });
    }
    async remove(id, userId, role) {
        await this.findOne(id, userId, role);
        return this.prisma.expense.delete({ where: { id } });
    }
    findAllCategories() {
        return this.prisma.expenseCategory.findMany({ orderBy: { name: 'asc' } });
    }
    createCategory(dto) {
        return this.prisma.expenseCategory.create({ data: dto });
    }
    async updateCategory(id, dto) {
        const category = await this.prisma.expenseCategory.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return this.prisma.expenseCategory.update({ where: { id }, data: dto });
    }
    include() {
        return {
            category: { select: { id: true, name: true } },
            vendor: { select: { id: true, name: true } },
            entity: { select: { id: true, name: true, code: true } },
            branch: { select: { id: true, name: true, code: true } },
            createdBy: { select: { id: true, firstName: true, lastName: true } },
        };
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map