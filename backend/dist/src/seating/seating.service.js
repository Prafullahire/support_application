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
exports.SeatingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SeatingService = class SeatingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(branchId, date) {
        const recordDate = date ? new Date(date) : undefined;
        return this.prisma.seatingRecord.findMany({
            where: {
                ...(branchId ? { branchId } : {}),
                ...(recordDate
                    ? {
                        recordDate: {
                            gte: new Date(recordDate.setHours(0, 0, 0, 0)),
                            lt: new Date(recordDate.setHours(23, 59, 59, 999)),
                        },
                    }
                    : {}),
            },
            include: { branch: { select: { id: true, name: true } } },
            orderBy: { recordDate: 'desc' },
        });
    }
    async findOne(id) {
        const record = await this.prisma.seatingRecord.findUnique({
            where: { id },
            include: { branch: { select: { id: true, name: true } } },
        });
        if (!record)
            throw new common_1.NotFoundException('Seating record not found');
        return record;
    }
    create(dto) {
        return this.prisma.seatingRecord.create({
            data: {
                ...dto,
                recordDate: dto.recordDate ? new Date(dto.recordDate) : undefined,
            },
            include: { branch: { select: { id: true, name: true } } },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.seatingRecord.update({
            where: { id },
            data: {
                ...dto,
                recordDate: dto.recordDate ? new Date(dto.recordDate) : undefined,
            },
            include: { branch: { select: { id: true, name: true } } },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.seatingRecord.delete({ where: { id } });
    }
};
exports.SeatingService = SeatingService;
exports.SeatingService = SeatingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeatingService);
//# sourceMappingURL=seating.service.js.map