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
exports.BaseCrudService = exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(userId, action, module, recordId, details) {
        await this.prisma.auditLog.create({
            data: {
                userId,
                action,
                module,
                recordId,
                details,
            },
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
let BaseCrudService = class BaseCrudService {
    constructor(prisma, modelName, auditService) {
        this.prisma = prisma;
        this.modelName = modelName;
        this.auditService = auditService;
    }
    get model() {
        return this.prisma[this.modelName];
    }
    async findAll(where = {}, include) {
        return this.model.findMany({
            where,
            include,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, include) {
        const record = await this.model.findUnique({ where: { id }, include });
        if (!record) {
            throw new common_1.NotFoundException(`${this.modelName} not found`);
        }
        return record;
    }
    async create(data, userId) {
        const record = await this.model.create({ data });
        if (this.auditService) {
            await this.auditService.log(userId, 'CREATE', this.modelName, record.id);
        }
        return record;
    }
    async update(id, data, userId) {
        await this.findOne(id);
        const record = await this.model.update({ where: { id }, data });
        if (this.auditService) {
            await this.auditService.log(userId, 'UPDATE', this.modelName, id);
        }
        return record;
    }
    async remove(id, userId) {
        await this.findOne(id);
        const record = await this.model.delete({ where: { id } });
        if (this.auditService) {
            await this.auditService.log(userId, 'DELETE', this.modelName, id);
        }
        return record;
    }
};
exports.BaseCrudService = BaseCrudService;
exports.BaseCrudService = BaseCrudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, String, AuditService])
], BaseCrudService);
//# sourceMappingURL=base.service.js.map