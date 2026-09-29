"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const notifications_module_1 = require("../notifications/notifications.module");
const attendance_service_1 = require("./attendance.service");
const attendance_controller_1 = require("./attendance.controller");
const attendance_correction_service_1 = require("./attendance-correction.service");
let AttendanceModule = class AttendanceModule {
};
exports.AttendanceModule = AttendanceModule;
exports.AttendanceModule = AttendanceModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, notifications_module_1.NotificationsModule],
        controllers: [attendance_controller_1.AttendanceController],
        providers: [attendance_service_1.AttendanceService, attendance_correction_service_1.AttendanceCorrectionService],
        exports: [attendance_service_1.AttendanceService, attendance_correction_service_1.AttendanceCorrectionService],
    })
], AttendanceModule);
//# sourceMappingURL=attendance.module.js.map