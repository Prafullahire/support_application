"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeBoyStaffService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../common/enums");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const office_boy_util_1 = require("../common/utils/office-boy.util");
let OfficeBoyStaffService = class OfficeBoyStaffService {
    constructor(prisma, usersService) {
        this.prisma = prisma;
        this.usersService = usersService;
    }
    findAll(branchId) {
        return this.prisma.user.findMany({
            where: {
                role: enums_1.UserRole.OFFICE_BOY,
                ...(branchId ? { branchId } : {}),
            },
            select: this.select(),
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findFirst({
            where: { id, role: enums_1.UserRole.OFFICE_BOY },
            select: this.select(),
        });
        if (!user)
            throw new common_1.NotFoundException('Office Boy staff not found');
        return user;
    }
    async create(dto) {
        const phone = (0, office_boy_util_1.normalizePhone)(dto.phone.trim());
        if (!phone) {
            throw new common_1.BadRequestException('Phone number is required');
        }
        const email = dto.email?.trim() || (0, office_boy_util_1.generateOfficeBoyEmail)(phone);
        const employeeId = dto.employeeId?.trim() || (0, office_boy_util_1.generateEmployeeId)(phone);
        const officeLocationId = dto.officeLocationId || (await this.resolveDefaultLocation(dto.branchId));
        await this.validateUnique(email, employeeId);
        await this.validatePhoneUnique(phone);
        await this.validateLocationBranch(officeLocationId, dto.branchId);
        const password = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: {
                email,
                password,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone,
                employeeId,
                role: enums_1.UserRole.OFFICE_BOY,
                branchId: dto.branchId,
                officeLocationId,
                isActive: dto.isActive ?? true,
            },
            select: this.select(),
        });
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        const email = dto.email ?? existing.email;
        const employeeId = dto.employeeId ?? existing.employeeId;
        if (dto.email || dto.employeeId) {
            await this.validateUnique(email, employeeId, id);
        }
        if (dto.phone && dto.phone !== existing.phone) {
            await this.validatePhoneUnique((0, office_boy_util_1.normalizePhone)(dto.phone), id);
        }
        const branchId = dto.branchId ?? existing.branchId;
        const officeLocationId = dto.officeLocationId ?? existing.officeLocationId;
        if (officeLocationId) {
            await this.validateLocationBranch(officeLocationId, branchId);
        }
        const { password, ...rest } = dto;
        const data = { ...rest };
        if (dto.phone) {
            data.phone = (0, office_boy_util_1.normalizePhone)(dto.phone);
        }
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data,
            select: this.select(),
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.usersService.remove(id);
    }
    async resolveDefaultLocation(branchId) {
        const location = await this.prisma.officeLocation.findFirst({
            where: { branchId, isActive: true },
            orderBy: { createdAt: 'asc' },
        });
        if (!location) {
            throw new common_1.BadRequestException('No office location found for this branch. Create one in Office Locations first.');
        }
        return location.id;
    }
    async validateUnique(email, employeeId, excludeId) {
        const emailExists = await this.prisma.user.findFirst({
            where: { email, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
        });
        if (emailExists)
            throw new common_1.ConflictException('Email already in use');
        const empExists = await this.prisma.user.findFirst({
            where: { employeeId, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
        });
        if (empExists)
            throw new common_1.ConflictException('Employee ID already in use');
    }
    async validatePhoneUnique(phone, excludeId) {
        const normalized = (0, office_boy_util_1.normalizePhone)(phone);
        const users = await this.prisma.user.findMany({
            where: {
                role: enums_1.UserRole.OFFICE_BOY,
                ...(excludeId ? { NOT: { id: excludeId } } : {}),
            },
            select: { id: true, phone: true },
        });
        const duplicate = users.find((u) => u.phone && (0, office_boy_util_1.normalizePhone)(u.phone) === normalized);
        if (duplicate) {
            throw new common_1.ConflictException('Phone number already in use');
        }
    }
    async validateLocationBranch(officeLocationId, branchId) {
        const location = await this.prisma.officeLocation.findUnique({
            where: { id: officeLocationId },
        });
        if (!location || !location.isActive) {
            throw new common_1.NotFoundException('Office location not found or inactive');
        }
        if (location.branchId !== branchId) {
            throw new common_1.ConflictException('Office location does not belong to the selected branch');
        }
    }
    select() {
        return {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            employeeId: true,
            role: true,
            branchId: true,
            officeLocationId: true,
            joiningDate: true,
            isActive: true,
            createdAt: true,
            branch: { select: { id: true, name: true, code: true } },
            officeLocation: {
                select: {
                    id: true,
                    name: true,
                    latitude: true,
                    longitude: true,
                    allowedRadiusMeters: true,
                },
            },
        };
    }
};
exports.OfficeBoyStaffService = OfficeBoyStaffService;
exports.OfficeBoyStaffService = OfficeBoyStaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], OfficeBoyStaffService);
//# sourceMappingURL=office-boy-staff.service.js.map