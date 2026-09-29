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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../common/enums");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const attendance_service_1 = require("./attendance.service");
const attendance_correction_service_1 = require("./attendance-correction.service");
const attendance_dto_1 = require("./dto/attendance.dto");
const attendance_correction_dto_1 = require("./dto/attendance-correction.dto");
let AttendanceController = class AttendanceController {
    constructor(service, correctionService) {
        this.service = service;
        this.correctionService = correctionService;
    }
    officeBoyLogin(dto) {
        return this.service.officeBoyLogin(dto);
    }
    officeBoyCheckIn(userId, dto) {
        return this.service.officeBoyCheckIn(userId, dto);
    }
    officeBoyLogout(userId, dto) {
        return this.service.officeBoyLogout(userId, dto);
    }
    getDashboard(userId) {
        return this.service.getMyDashboard(userId);
    }
    getMyHistory(userId, filters) {
        return this.service.getMyHistory(userId, filters);
    }
    getAll(filters) {
        return this.service.getAllAttendance(filters);
    }
    getActivityLogs(userId) {
        return this.service.getActivityLogs(userId);
    }
    createCorrection(userId, dto) {
        return this.correctionService.create(userId, dto);
    }
    getMyCorrections(userId) {
        return this.correctionService.findMyRequests(userId);
    }
    getAllCorrections(user, status, branchId) {
        return this.correctionService.findAllForAdmin(user, status, branchId);
    }
    getCorrection(id, userId, role) {
        return this.correctionService.findOne(id, userId, role);
    }
    approveCorrection(id, adminId, dto) {
        return this.correctionService.approve(id, adminId, dto);
    }
    rejectCorrection(id, adminId, dto) {
        return this.correctionService.reject(id, adminId, dto);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('office-boy/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.OfficeBoyLoginDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "officeBoyLogin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.OFFICE_BOY),
    (0, common_1.Post)('office-boy/check-in'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_dto_1.OfficeBoyCheckInDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "officeBoyCheckIn", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.OFFICE_BOY),
    (0, common_1.Post)('office-boy/logout'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_dto_1.OfficeBoyLogoutDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "officeBoyLogout", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.OFFICE_BOY),
    (0, common_1.Get)('office-boy/dashboard'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getDashboard", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.OFFICE_BOY),
    (0, common_1.Get)('office-boy/history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_dto_1.AttendanceFilterDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getMyHistory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.AdminRoles)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.AttendanceFilterDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.AdminRoles)(),
    (0, common_1.Get)('activity-logs'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getActivityLogs", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.OFFICE_BOY),
    (0, common_1.Post)('corrections'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_correction_dto_1.CreateAttendanceCorrectionDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "createCorrection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.OFFICE_BOY),
    (0, common_1.Get)('corrections/my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getMyCorrections", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.AdminRoles)(),
    (0, common_1.Get)('corrections'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getAllCorrections", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)('corrections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getCorrection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.AdminRoles)(),
    (0, common_1.Patch)('corrections/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, attendance_correction_dto_1.ReviewAttendanceCorrectionDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "approveCorrection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.AdminRoles)(),
    (0, common_1.Patch)('corrections/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, attendance_correction_dto_1.ReviewAttendanceCorrectionDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "rejectCorrection", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('attendance'),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService,
        attendance_correction_service_1.AttendanceCorrectionService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map