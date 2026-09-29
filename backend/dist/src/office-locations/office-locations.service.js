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
exports.OfficeLocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OfficeLocationsService = class OfficeLocationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(branchId) {
        return this.prisma.officeLocation.findMany({
            where: {
                ...(branchId ? { branchId } : {}),
            },
            include: {
                branch: { select: { id: true, name: true, code: true } },
                _count: { select: { staff: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const location = await this.prisma.officeLocation.findUnique({
            where: { id },
            include: {
                branch: { select: { id: true, name: true, code: true } },
                staff: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        employeeId: true,
                        email: true,
                        isActive: true,
                    },
                },
            },
        });
        if (!location)
            throw new common_1.NotFoundException('Office location not found');
        return location;
    }
    create(dto) {
        return this.prisma.officeLocation.create({
            data: {
                name: dto.name,
                branchId: dto.branchId,
                latitude: dto.latitude,
                longitude: dto.longitude,
                allowedRadiusMeters: dto.allowedRadiusMeters ?? 100,
                isActive: dto.isActive ?? true,
            },
            include: { branch: { select: { id: true, name: true } } },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.officeLocation.update({
            where: { id },
            data: dto,
            include: { branch: { select: { id: true, name: true } } },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.officeLocation.delete({ where: { id } });
    }
};
exports.OfficeLocationsService = OfficeLocationsService;
exports.OfficeLocationsService = OfficeLocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OfficeLocationsService);
//# sourceMappingURL=office-locations.service.js.map