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
exports.PgRecordsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PgRecordsService = class PgRecordsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(branchId, status) {
        return this.prisma.pgRecord.findMany({
            where: {
                ...(branchId ? { branchId } : {}),
                ...(status ? { status } : {}),
            },
            include: { branch: { select: { id: true, name: true } } },
            orderBy: { agreementEnd: 'asc' },
        });
    }
    async findOne(id) {
        const record = await this.prisma.pgRecord.findUnique({
            where: { id },
            include: { branch: { select: { id: true, name: true } } },
        });
        if (!record)
            throw new common_1.NotFoundException('PG record not found');
        return record;
    }
    create(dto) {
        return this.prisma.pgRecord.create({
            data: {
                ...dto,
                agreementStart: new Date(dto.agreementStart),
                agreementEnd: new Date(dto.agreementEnd),
            },
            include: { branch: { select: { id: true, name: true } } },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.pgRecord.update({
            where: { id },
            data: {
                ...dto,
                agreementStart: dto.agreementStart ? new Date(dto.agreementStart) : undefined,
                agreementEnd: dto.agreementEnd ? new Date(dto.agreementEnd) : undefined,
            },
            include: { branch: { select: { id: true, name: true } } },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.pgRecord.delete({ where: { id } });
    }
};
exports.PgRecordsService = PgRecordsService;
exports.PgRecordsService = PgRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PgRecordsService);
//# sourceMappingURL=pg-records.service.js.map