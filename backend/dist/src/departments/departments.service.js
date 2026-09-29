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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DepartmentsService = class DepartmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(branchId) {
        return this.prisma.department.findMany({
            where: branchId ? { branchId } : undefined,
            include: { branch: { select: { id: true, name: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const department = await this.prisma.department.findUnique({
            where: { id },
            include: { branch: { select: { id: true, name: true } } },
        });
        if (!department)
            throw new common_1.NotFoundException('Department not found');
        return department;
    }
    create(dto) {
        return this.prisma.department.create({
            data: dto,
            include: { branch: { select: { id: true, name: true } } },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.department.update({
            where: { id },
            data: dto,
            include: { branch: { select: { id: true, name: true } } },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.department.delete({ where: { id } });
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map