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
exports.IdCardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IdCardsService = class IdCardsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(branchId, availableOnly = false) {
        return this.prisma.idCard.findMany({
            where: {
                ...(branchId ? { branchId } : {}),
                ...(availableOnly ? { isAvailable: true } : {}),
            },
            include: {
                branch: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
            orderBy: { cardNumber: 'asc' },
        });
    }
    async findOne(id) {
        const card = await this.prisma.idCard.findUnique({
            where: { id },
            include: {
                branch: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        });
        if (!card)
            throw new common_1.NotFoundException('ID card not found');
        return card;
    }
    create(dto) {
        return this.prisma.idCard.create({
            data: dto,
            include: {
                branch: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.idCard.update({
            where: { id },
            data: dto,
            include: {
                branch: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, firstName: true, lastName: true } },
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.idCard.delete({ where: { id } });
    }
    async assign(id, dto) {
        const card = await this.findOne(id);
        if (!card.isAvailable) {
            throw new common_1.BadRequestException('ID card is not available');
        }
        return this.prisma.idCard.update({
            where: { id },
            data: {
                assignedToId: dto.assignedToId,
                assignedAt: new Date(),
                isAvailable: false,
            },
            include: {
                branch: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        });
    }
    async unassign(id) {
        const card = await this.findOne(id);
        if (card.isAvailable) {
            throw new common_1.BadRequestException('ID card is not assigned');
        }
        return this.prisma.idCard.update({
            where: { id },
            data: {
                assignedToId: null,
                assignedAt: null,
                isAvailable: true,
            },
            include: {
                branch: { select: { id: true, name: true } },
            },
        });
    }
};
exports.IdCardsService = IdCardsService;
exports.IdCardsService = IdCardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IdCardsService);
//# sourceMappingURL=id-cards.service.js.map