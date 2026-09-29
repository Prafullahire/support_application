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
exports.BrochuresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BrochuresService = class BrochuresService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAllStock(branchId) {
        return this.prisma.brochureStock.findMany({
            where: branchId ? { branchId } : undefined,
            include: { branch: { select: { id: true, name: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async findOneStock(id) {
        const stock = await this.prisma.brochureStock.findUnique({
            where: { id },
            include: { branch: { select: { id: true, name: true } } },
        });
        if (!stock)
            throw new common_1.NotFoundException('Brochure stock not found');
        return stock;
    }
    createStock(dto) {
        return this.prisma.brochureStock.create({
            data: dto,
            include: { branch: { select: { id: true, name: true } } },
        });
    }
    async updateStock(id, dto) {
        await this.findOneStock(id);
        return this.prisma.brochureStock.update({
            where: { id },
            data: dto,
            include: { branch: { select: { id: true, name: true } } },
        });
    }
    async removeStock(id) {
        await this.findOneStock(id);
        return this.prisma.brochureStock.delete({ where: { id } });
    }
    findAllIssues() {
        return this.prisma.brochureIssue.findMany({
            include: {
                stock: true,
                user: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }
    async issueBrochure(dto) {
        const stock = await this.findOneStock(dto.stockId);
        if (stock.quantity < dto.quantity) {
            throw new common_1.BadRequestException('Insufficient brochure stock');
        }
        const issueNumber = `BR-${Date.now()}`;
        const [issue] = await this.prisma.$transaction([
            this.prisma.brochureIssue.create({
                data: {
                    issueNumber,
                    stockId: dto.stockId,
                    userId: dto.userId,
                    quantity: dto.quantity,
                    notes: dto.notes,
                },
                include: {
                    stock: true,
                    user: { select: { id: true, firstName: true, lastName: true } },
                },
            }),
            this.prisma.brochureStock.update({
                where: { id: dto.stockId },
                data: { quantity: stock.quantity - dto.quantity },
            }),
        ]);
        return issue;
    }
};
exports.BrochuresService = BrochuresService;
exports.BrochuresService = BrochuresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BrochuresService);
//# sourceMappingURL=brochures.service.js.map