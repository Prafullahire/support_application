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
exports.JoiningKitService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JoiningKitService = class JoiningKitService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAllItems() {
        return this.prisma.joiningKitItem.findMany({ orderBy: { name: 'asc' } });
    }
    async findOneItem(id) {
        const item = await this.prisma.joiningKitItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Joining kit item not found');
        return item;
    }
    createItem(dto) {
        return this.prisma.joiningKitItem.create({ data: dto });
    }
    async updateItem(id, dto) {
        await this.findOneItem(id);
        return this.prisma.joiningKitItem.update({ where: { id }, data: dto });
    }
    findAllStock(branchId) {
        return this.prisma.joiningKitStock.findMany({
            where: branchId ? { branchId } : undefined,
            include: {
                item: true,
                branch: { select: { id: true, name: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async upsertStock(dto) {
        const include = {
            item: true,
            branch: { select: { id: true, name: true } },
        };
        const existing = await this.prisma.joiningKitStock.findFirst({
            where: {
                itemId: dto.itemId,
                branchId: dto.branchId ?? null,
            },
        });
        if (existing) {
            return this.prisma.joiningKitStock.update({
                where: { id: existing.id },
                data: {
                    quantity: dto.quantity,
                    ...(dto.minStock !== undefined ? { minStock: dto.minStock } : {}),
                },
                include,
            });
        }
        return this.prisma.joiningKitStock.create({
            data: {
                itemId: dto.itemId,
                branchId: dto.branchId,
                quantity: dto.quantity,
                minStock: dto.minStock ?? 5,
            },
            include,
        });
    }
    findAllIssues() {
        return this.prisma.joiningKitIssue.findMany({
            include: {
                user: { select: { id: true, firstName: true, lastName: true } },
                items: { include: { item: true } },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }
    async issueKit(dto) {
        const issueNumber = `JK-${Date.now()}`;
        return this.prisma.$transaction(async (tx) => {
            for (const line of dto.items) {
                const stock = await tx.joiningKitStock.findFirst({
                    where: { itemId: line.itemId },
                });
                if (!stock || stock.quantity < line.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for item ${line.itemId}`);
                }
                await tx.joiningKitStock.update({
                    where: { id: stock.id },
                    data: { quantity: stock.quantity - line.quantity },
                });
            }
            return tx.joiningKitIssue.create({
                data: {
                    issueNumber,
                    userId: dto.userId,
                    employeeId: dto.employeeId,
                    employeeName: dto.employeeName,
                    location: dto.location,
                    branchId: dto.branchId,
                    joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : null,
                    notes: dto.notes,
                    items: {
                        create: dto.items.map((item) => ({
                            itemId: item.itemId,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: {
                    user: { select: { id: true, firstName: true, lastName: true } },
                    items: { include: { item: true } },
                },
            });
        });
    }
    async returnKit(id, dto) {
        const issue = await this.prisma.joiningKitIssue.findUnique({
            where: { id },
        });
        if (!issue)
            throw new common_1.NotFoundException('Joining kit issue not found');
        if (issue.isReturned)
            throw new common_1.BadRequestException('Kit already returned');
        return this.prisma.joiningKitIssue.update({
            where: { id },
            data: {
                isReturned: true,
                returnedAt: new Date(),
                ...(dto.notes ? { notes: dto.notes } : {}),
            },
        });
    }
};
exports.JoiningKitService = JoiningKitService;
exports.JoiningKitService = JoiningKitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JoiningKitService);
//# sourceMappingURL=joining-kit.service.js.map