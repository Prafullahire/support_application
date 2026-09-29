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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../common/enums");
const prisma_service_1 = require("../prisma/prisma.service");
let AssetsService = class AssetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(branchId, status) {
        return this.prisma.asset.findMany({
            where: {
                ...(branchId ? { branchId } : {}),
                ...(status ? { status } : {}),
            },
            include: this.assetInclude(),
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
            include: {
                ...this.assetInclude(),
                assignments: {
                    include: { user: { select: { id: true, firstName: true, lastName: true } } },
                    orderBy: { assignedAt: 'desc' },
                },
            },
        });
        if (!asset)
            throw new common_1.NotFoundException('Asset not found');
        return asset;
    }
    create(dto) {
        return this.prisma.asset.create({
            data: {
                ...dto,
                purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
                assignedDate: dto.assignedDate ? new Date(dto.assignedDate) : undefined,
                warrantyEnd: dto.warrantyEnd ? new Date(dto.warrantyEnd) : undefined,
            },
            include: this.assetInclude(),
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.asset.update({
            where: { id },
            data: {
                ...dto,
                purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
                assignedDate: dto.assignedDate ? new Date(dto.assignedDate) : undefined,
                warrantyEnd: dto.warrantyEnd ? new Date(dto.warrantyEnd) : undefined,
            },
            include: this.assetInclude(),
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.asset.delete({ where: { id } });
    }
    async assign(id, dto) {
        const asset = await this.findOne(id);
        if (asset.status === enums_1.AssetStatus.ASSIGNED) {
            throw new common_1.BadRequestException('Asset is already assigned');
        }
        const [assignment] = await this.prisma.$transaction([
            this.prisma.assetAssignment.create({
                data: {
                    assetId: id,
                    userId: dto.userId,
                    condition: dto.condition,
                    notes: dto.notes,
                },
                include: { user: { select: { id: true, firstName: true, lastName: true } } },
            }),
            this.prisma.asset.update({
                where: { id },
                data: { status: enums_1.AssetStatus.ASSIGNED },
            }),
        ]);
        return assignment;
    }
    async returnAsset(id, dto) {
        const asset = await this.findOne(id);
        if (asset.status !== enums_1.AssetStatus.ASSIGNED) {
            throw new common_1.BadRequestException('Asset is not currently assigned');
        }
        const activeAssignment = await this.prisma.assetAssignment.findFirst({
            where: { assetId: id, returnedAt: null },
            orderBy: { assignedAt: 'desc' },
        });
        if (!activeAssignment) {
            throw new common_1.BadRequestException('No active assignment found');
        }
        const [assignment] = await this.prisma.$transaction([
            this.prisma.assetAssignment.update({
                where: { id: activeAssignment.id },
                data: {
                    returnedAt: new Date(),
                    condition: dto.condition ?? activeAssignment.condition,
                    notes: dto.notes ?? activeAssignment.notes,
                },
                include: { user: { select: { id: true, firstName: true, lastName: true } } },
            }),
            this.prisma.asset.update({
                where: { id },
                data: { status: enums_1.AssetStatus.AVAILABLE },
            }),
        ]);
        return assignment;
    }
    findAllCategories() {
        return this.prisma.assetCategory.findMany({ orderBy: { name: 'asc' } });
    }
    createCategory(dto) {
        return this.prisma.assetCategory.create({ data: dto });
    }
    async updateCategory(id, dto) {
        const category = await this.prisma.assetCategory.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return this.prisma.assetCategory.update({ where: { id }, data: dto });
    }
    assetInclude() {
        return {
            category: { select: { id: true, name: true } },
            branch: { select: { id: true, name: true } },
        };
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map