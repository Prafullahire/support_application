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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const enums_1 = require("../common/enums");
const branch_scope_util_1 = require("../common/utils/branch-scope.util");
const prisma_service_1 = require("../prisma/prisma.service");
const user_cleanup_util_1 = require("../common/utils/user-cleanup.util");
const office_boy_util_1 = require("../common/utils/office-boy.util");
const user_welcome_notification_service_1 = require("./user-welcome-notification.service");
let UsersService = class UsersService {
    constructor(prisma, welcomeNotificationService) {
        this.prisma = prisma;
        this.welcomeNotificationService = welcomeNotificationService;
    }
    findAll(actor) {
        const where = actor ? (0, branch_scope_util_1.resolveBranchFilter)(actor) : {};
        return this.prisma.user.findMany({
            where,
            select: this.select(),
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, actor) {
        const user = await this.prisma.user.findUnique({ where: { id }, select: this.select() });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (actor) {
            (0, branch_scope_util_1.assertBranchAccess)(actor, user.branchId);
        }
        return user;
    }
    async create(dto, actor) {
        const role = dto.role ?? enums_1.UserRole.ADMIN;
        if (actor && !(0, branch_scope_util_1.canAssignRole)(actor, role)) {
            throw new common_1.ForbiddenException('You cannot assign this role');
        }
        const branchId = actor ? (0, branch_scope_util_1.enforceActorBranchId)(actor, dto.branchId) : dto.branchId;
        if (role !== enums_1.UserRole.OFFICE_BOY && !dto.email?.trim()) {
            throw new common_1.BadRequestException('Email is required');
        }
        if (role === enums_1.UserRole.OFFICE_BOY) {
            if (!dto.phone?.trim()) {
                throw new common_1.BadRequestException('Phone number is required for Office Boy role');
            }
            if (!branchId) {
                throw new common_1.BadRequestException('Branch is required for Office Boy role');
            }
            const officeLocationId = dto.officeLocationId || (await this.resolveDefaultLocation(branchId));
            await this.validateOfficeBoyFields({
                phone: dto.phone,
                branchId,
                officeLocationId,
            });
            const email = dto.email?.trim() || (0, office_boy_util_1.generateOfficeBoyEmail)(dto.phone);
            const employeeId = dto.employeeId?.trim() || (0, office_boy_util_1.generateEmployeeId)(dto.phone);
            await this.validateUnique(email, employeeId);
            await this.validatePhoneUnique(dto.phone);
        }
        const password = await bcrypt.hash(dto.password, 10);
        const data = await this.buildUserData({ ...dto, role, branchId }, password);
        const user = await this.prisma.user.create({
            data,
            select: this.select(),
        });
        void this.welcomeNotificationService.sendWelcomeNotifications(user).catch(() => undefined);
        return user;
    }
    async update(id, dto, actor) {
        const existing = await this.prisma.user.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('User not found');
        }
        if (actor) {
            (0, branch_scope_util_1.assertBranchAccess)(actor, existing.branchId);
        }
        const nextRole = dto.role ?? existing.role;
        if (actor && dto.role && !(0, branch_scope_util_1.canAssignRole)(actor, nextRole)) {
            throw new common_1.ForbiddenException('You cannot assign this role');
        }
        const { password, joiningDate, leavingDate, address, branchId, ...rest } = dto;
        const data = { ...rest };
        if (branchId !== undefined) {
            data.branchId = actor ? (0, branch_scope_util_1.enforceActorBranchId)(actor, branchId) : branchId;
        }
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }
        if (joiningDate !== undefined) {
            data.joiningDate = joiningDate ? new Date(joiningDate) : null;
        }
        if (leavingDate !== undefined) {
            data.leavingDate = leavingDate ? new Date(leavingDate) : null;
        }
        if (address !== undefined) {
            data.address = address?.trim() || null;
        }
        if (nextRole === enums_1.UserRole.OFFICE_BOY) {
            const phone = dto.phone ? (0, office_boy_util_1.normalizePhone)(dto.phone) : existing.phone;
            const branchId = dto.branchId ?? existing.branchId;
            let officeLocationId = dto.officeLocationId ?? existing.officeLocationId;
            if (!officeLocationId && branchId) {
                officeLocationId = await this.resolveDefaultLocation(branchId);
            }
            await this.validateOfficeBoyFields({
                phone,
                branchId,
                officeLocationId,
            });
            const employeeId = dto.employeeId ?? existing.employeeId ?? (phone ? (0, office_boy_util_1.generateEmployeeId)(phone) : null);
            if (dto.email || dto.employeeId || phone) {
                await this.validateUnique(dto.email ?? existing.email, employeeId, id);
            }
            if (dto.phone) {
                await this.validatePhoneUnique((0, office_boy_util_1.normalizePhone)(dto.phone), id);
                data.phone = (0, office_boy_util_1.normalizePhone)(dto.phone);
            }
            data.departmentId = null;
            data.officeLocationId = officeLocationId;
            data.employeeId = employeeId;
        }
        else if (dto.role && dto.role !== enums_1.UserRole.OFFICE_BOY) {
            data.employeeId = null;
            data.officeLocationId = null;
            data.joiningDate = null;
            data.leavingDate = null;
            data.address = null;
        }
        return this.prisma.user.update({
            where: { id },
            data,
            select: this.select(),
        });
    }
    async remove(id, actor) {
        const user = await this.findOne(id, actor);
        try {
            await this.prisma.$transaction(async (tx) => {
                await (0, user_cleanup_util_1.deleteUserRelations)(tx, id);
                await tx.user.delete({ where: { id } });
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new common_1.BadRequestException('Cannot delete user because related records still exist. Deactivate the user instead.');
                }
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException('User not found');
                }
            }
            throw error;
        }
        return user;
    }
    async buildUserData(dto, password) {
        const isOfficeBoy = dto.role === enums_1.UserRole.OFFICE_BOY;
        const phone = dto.phone?.trim();
        const email = isOfficeBoy
            ? dto.email?.trim() || (0, office_boy_util_1.generateOfficeBoyEmail)(phone)
            : dto.email.trim();
        const employeeId = isOfficeBoy
            ? dto.employeeId?.trim() || (0, office_boy_util_1.generateEmployeeId)(phone)
            : null;
        let officeLocationId = isOfficeBoy ? dto.officeLocationId : null;
        if (isOfficeBoy && !officeLocationId && dto.branchId) {
            officeLocationId = await this.resolveDefaultLocation(dto.branchId);
        }
        return {
            email,
            password,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: isOfficeBoy ? (0, office_boy_util_1.normalizePhone)(phone) : dto.phone,
            role: dto.role,
            branchId: dto.branchId,
            departmentId: isOfficeBoy ? null : dto.departmentId,
            employeeId,
            officeLocationId,
            joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : null,
            leavingDate: dto.leavingDate ? new Date(dto.leavingDate) : null,
            address: dto.address?.trim() || null,
        };
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
    async validateOfficeBoyFields(fields) {
        if (!fields.phone?.trim()) {
            throw new common_1.BadRequestException('Phone number is required for Office Boy role');
        }
        if (!fields.branchId) {
            throw new common_1.BadRequestException('Branch is required for Office Boy role');
        }
        if (!fields.officeLocationId) {
            throw new common_1.BadRequestException('Office location is required for Office Boy role');
        }
        const location = await this.prisma.officeLocation.findUnique({
            where: { id: fields.officeLocationId },
        });
        if (!location || !location.isActive) {
            throw new common_1.NotFoundException('Office location not found or inactive');
        }
        if (location.branchId !== fields.branchId) {
            throw new common_1.ConflictException('Office location does not belong to the selected branch');
        }
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
    select() {
        return {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            branchId: true,
            departmentId: true,
            employeeId: true,
            officeLocationId: true,
            joiningDate: true,
            leavingDate: true,
            address: true,
            isActive: true,
            createdAt: true,
            branch: { select: { id: true, name: true } },
            department: { select: { id: true, name: true } },
            officeLocation: { select: { id: true, name: true } },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_welcome_notification_service_1.UserWelcomeNotificationService])
], UsersService);
//# sourceMappingURL=users.service.js.map