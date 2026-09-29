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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const enums_1 = require("../common/enums");
const roles_constants_1 = require("../common/constants/roles.constants");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const office_boy_util_1 = require("../common/utils/office-boy.util");
let AuthService = class AuthService {
    constructor(prisma, jwtService, config, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
        this.mailService = mailService;
    }
    async register(dto) {
        const isEmail = dto.emailOrPhone.includes('@');
        const email = isEmail ? dto.emailOrPhone.toLowerCase() : (dto.email?.toLowerCase() || null);
        const phone = !isEmail ? (0, office_boy_util_1.normalizePhone)(dto.emailOrPhone) : (dto.phone ? (0, office_boy_util_1.normalizePhone)(dto.phone) : null);
        if (!email) {
            throw new common_1.BadRequestException('An email is required for registration.');
        }
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    ...(phone ? [{ phone }] : []),
                ],
            },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email or phone already exists.');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                email,
                phone,
                password: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName,
                branchId: dto.branchId?.trim() || null,
                officeLocationId: dto.officeLocationId?.trim() || null,
                joiningDate: dto.joiningDate && dto.joiningDate.trim() ? new Date(dto.joiningDate) : null,
                leavingDate: dto.leavingDate && dto.leavingDate.trim() ? new Date(dto.leavingDate) : null,
                address: dto.address?.trim() || null,
                role: enums_1.UserRole.ADMIN,
            },
            select: this.userSelect(),
        });
        return this.generateTokens(newUser);
    }
    async login(dto) {
        const user = await this.findUserByEmailOrPhone(dto.emailOrPhone);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.role === enums_1.UserRole.OFFICE_BOY) {
            throw new common_1.BadRequestException('Office Boy staff must use the Office Boy login with location verification.');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const safeUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: this.userSelect(),
        });
        return this.generateTokens(safeUser);
    }
    async findUserByEmailOrPhone(value) {
        const trimmed = value.trim();
        const emailLower = trimmed.toLowerCase();
        const normalizedPhone = (0, office_boy_util_1.normalizePhone)(trimmed);
        const direct = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailLower },
                    { email: trimmed },
                    { phone: trimmed },
                    ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
                ],
            },
        });
        if (direct)
            return direct;
        if (!normalizedPhone)
            return null;
        const usersWithPhone = await this.prisma.user.findMany({
            where: { phone: { not: null } },
        });
        return usersWithPhone.find((user) => user.phone && (0, office_boy_util_1.normalizePhone)(user.phone) === normalizedPhone) ?? null;
    }
    async refresh(refreshToken) {
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!stored || stored.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        await this.prisma.refreshToken.deleteMany({ where: { id: stored.id } });
        const user = await this.prisma.user.findUnique({
            where: { id: stored.userId },
            select: this.userSelect(),
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.generateTokens(user);
    }
    async logout(refreshToken) {
        await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        return { message: 'Logged out successfully' };
    }
    async getProfile(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: this.userSelect(),
        });
    }
    async forgotPassword(email) {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !normalizedEmail.includes('@')) {
            throw new common_1.BadRequestException('Please enter a valid admin email address.');
        }
        const user = await this.prisma.user.findFirst({
            where: { email: normalizedEmail },
        });
        if (!user) {
            return {
                message: 'If an admin account exists with this email, you will receive a password reset link shortly.',
            };
        }
        if (!(0, roles_constants_1.isPrivilegedAdmin)(user.role)) {
            throw new common_1.BadRequestException('Password reset is only available for admin accounts.');
        }
        if (!user.isActive) {
            throw new common_1.BadRequestException('This admin account is inactive. Contact support.');
        }
        try {
            await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
        }
        catch (error) {
            this.throwPasswordResetSchemaError(error);
        }
        const token = (0, crypto_1.randomBytes)(48).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        try {
            await this.prisma.passwordResetToken.create({
                data: {
                    token,
                    userId: user.id,
                    expiresAt,
                },
            });
        }
        catch (error) {
            this.throwPasswordResetSchemaError(error);
        }
        const frontendUrl = (this.config.get('FRONTEND_URL') || 'http://localhost:3000').replace(/\/$/, '');
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        await this.mailService.sendMail({
            to: user.email,
            subject: 'Reset your admin password',
            text: `Hello ${user.firstName},\n\n` +
                `We received a request to reset your admin password.\n\n` +
                `Open this link to set a new password (valid for 1 hour):\n${resetLink}\n\n` +
                `If you did not request this, you can ignore this email.`,
            html: `<p>Hello ${user.firstName},</p>` +
                `<p>We received a request to reset your admin password.</p>` +
                `<p><a href="${resetLink}">Click here to set a new password</a></p>` +
                `<p>This link is valid for 1 hour.</p>` +
                `<p>If you did not request this, you can ignore this email.</p>`,
        });
        return {
            message: 'If an admin account exists with this email, you will receive a password reset link shortly.',
        };
    }
    async resetPassword(token, newPassword) {
        const trimmedToken = token.trim();
        if (!trimmedToken) {
            throw new common_1.BadRequestException('Reset token is required.');
        }
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token: trimmedToken },
            include: { user: true },
        });
        if (!resetToken ||
            resetToken.usedAt ||
            resetToken.expiresAt < new Date() ||
            !(0, roles_constants_1.isPrivilegedAdmin)(resetToken.user.role) ||
            !resetToken.user.isActive) {
            throw new common_1.BadRequestException('Invalid or expired reset link. Please request a new one.');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
            this.prisma.refreshToken.deleteMany({ where: { userId: resetToken.userId } }),
        ]);
        return {
            message: 'Password updated successfully. You can now sign in with your new password.',
        };
    }
    async getRegisterBranches() {
        return this.prisma.branch.findMany({
            where: { isActive: true },
            select: { id: true, name: true, code: true },
            orderBy: { name: 'asc' },
        });
    }
    async getRegisterOfficeLocations(branchId) {
        return this.prisma.officeLocation.findMany({
            where: {
                isActive: true,
                ...(branchId ? { branchId } : {}),
            },
            select: { id: true, name: true, branchId: true },
            orderBy: { name: 'asc' },
        });
    }
    async issueTokensForUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: this.userSelect(),
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.generateTokens(user);
    }
    throwPasswordResetSchemaError(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            (error.code === 'P2021' || error.code === 'P2022')) {
            throw new common_1.InternalServerErrorException('Password reset is not ready on the server. Run "npm run db:push" in the backend folder, then restart the API.');
        }
        throw error;
    }
    async generateTokens(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const secret = this.config.get('JWT_SECRET') || process.env.JWT_SECRET || 'support-app-default-jwt-secret-key-32chars!';
        const accessToken = this.jwtService.sign(payload, {
            secret,
            expiresIn: this.config.get('JWT_EXPIRES_IN') || '30m',
        });
        const refreshToken = (0, crypto_1.randomBytes)(40).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            },
        });
        return { user, accessToken, refreshToken };
    }
    userSelect() {
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
            branch: { select: { id: true, name: true, code: true } },
            department: { select: { id: true, name: true } },
            officeLocation: { select: { id: true, name: true, allowedRadiusMeters: true } },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map