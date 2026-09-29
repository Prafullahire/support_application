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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(body) {
        const emailOrPhone = (body.emailOrPhone || body.email || body.phone || '').trim();
        if (!emailOrPhone) {
            throw new common_1.BadRequestException('Email or phone number is required');
        }
        if (!body.password || body.password.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters');
        }
        if (!body.firstName?.trim() || !body.lastName?.trim()) {
            throw new common_1.BadRequestException('First name and last name are required');
        }
        return this.authService.register({
            emailOrPhone,
            password: body.password,
            firstName: body.firstName.trim(),
            lastName: body.lastName.trim(),
            branchId: body.branchId,
            officeLocationId: body.officeLocationId,
            joiningDate: body.joiningDate,
            leavingDate: body.leavingDate,
            address: body.address,
        });
    }
    getRegisterBranches() {
        return this.authService.getRegisterBranches();
    }
    getRegisterOfficeLocations(branchId) {
        return this.authService.getRegisterOfficeLocations(branchId);
    }
    login(body) {
        const emailOrPhone = (body.emailOrPhone || body.email || body.phone || '').trim();
        if (!emailOrPhone) {
            throw new common_1.BadRequestException('Email or phone number is required');
        }
        if (!body.password) {
            throw new common_1.BadRequestException('Password is required');
        }
        return this.authService.login({
            emailOrPhone,
            password: body.password,
        });
    }
    refresh(body) {
        if (!body.refreshToken) {
            throw new common_1.BadRequestException('Refresh token is required');
        }
        return this.authService.refresh(body.refreshToken);
    }
    logout(body) {
        if (!body.refreshToken) {
            throw new common_1.BadRequestException('Refresh token is required');
        }
        return this.authService.logout(body.refreshToken);
    }
    forgotPassword(body) {
        const email = (body.email || '').trim();
        if (!email) {
            throw new common_1.BadRequestException('Email is required');
        }
        return this.authService.forgotPassword(email);
    }
    resetPassword(body) {
        const token = (body.token || '').trim();
        const password = body.password || '';
        if (!token) {
            throw new common_1.BadRequestException('Reset token is required');
        }
        if (!password || password.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters');
        }
        return this.authService.resetPassword(token, password);
    }
    getProfile(userId) {
        return this.authService.getProfile(userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('register/branches'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getRegisterBranches", null);
__decorate([
    (0, common_1.Get)('register/office-locations'),
    __param(0, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getRegisterOfficeLocations", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: false,
        forbidNonWhitelisted: false,
        transform: false,
    })),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map