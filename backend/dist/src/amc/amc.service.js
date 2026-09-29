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
exports.AmcService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../common/enums");
const prisma_service_1 = require("../prisma/prisma.service");
let AmcService = class AmcService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(branchId, status) {
        return this.prisma.amcRecord.findMany({
            where: {
                ...(branchId ? { branchId } : {}),
                ...(status ? { status } : {}),
            },
            include: this.include(),
            orderBy: { endDate: 'asc' },
        });
    }
    async findOne(id) {
        const record = await this.prisma.amcRecord.findUnique({
            where: { id },
            include: this.include(),
        });
        if (!record)
            throw new common_1.NotFoundException('AMC record not found');
        return record;
    }
    create(dto) {
        return this.prisma.amcRecord.create({
            data: {
                ...dto,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
            },
            include: this.include(),
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.amcRecord.update({
            where: { id },
            data: {
                ...dto,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            },
            include: this.include(),
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.amcRecord.delete({ where: { id } });
    }
    async findExpiring(days = 30, branchId) {
        const now = new Date();
        const threshold = new Date();
        threshold.setDate(threshold.getDate() + days);
        const records = await this.prisma.amcRecord.findMany({
            where: {
                status: enums_1.AmcStatus.ACTIVE,
                endDate: { lte: threshold, gte: now },
                ...(branchId ? { branchId } : {}),
            },
            include: this.include(),
            orderBy: { endDate: 'asc' },
        });
        const expired = await this.prisma.amcRecord.findMany({
            where: {
                status: enums_1.AmcStatus.ACTIVE,
                endDate: { lt: now },
                ...(branchId ? { branchId } : {}),
            },
            include: this.include(),
            orderBy: { endDate: 'asc' },
        });
        return { expiringSoon: records, expired };
    }
    include() {
        return {
            vendor: { select: { id: true, name: true } },
            branch: { select: { id: true, name: true } },
        };
    }
};
exports.AmcService = AmcService;
exports.AmcService = AmcService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AmcService);
//# sourceMappingURL=amc.service.js.map