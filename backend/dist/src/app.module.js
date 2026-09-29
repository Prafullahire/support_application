"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const mail_module_1 = require("./mail/mail.module");
const sms_module_1 = require("./sms/sms.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const branches_module_1 = require("./branches/branches.module");
const entities_module_1 = require("./entities/entities.module");
const departments_module_1 = require("./departments/departments.module");
const vendors_module_1 = require("./vendors/vendors.module");
const requests_module_1 = require("./requests/requests.module");
const courier_module_1 = require("./courier/courier.module");
const assets_module_1 = require("./assets/assets.module");
const joining_kit_module_1 = require("./joining-kit/joining-kit.module");
const expenses_module_1 = require("./expenses/expenses.module");
const id_cards_module_1 = require("./id-cards/id-cards.module");
const amc_module_1 = require("./amc/amc.module");
const seating_module_1 = require("./seating/seating.module");
const brochures_module_1 = require("./brochures/brochures.module");
const pg_records_module_1 = require("./pg-records/pg-records.module");
const notifications_module_1 = require("./notifications/notifications.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const reports_module_1 = require("./reports/reports.module");
const imports_module_1 = require("./imports/imports.module");
const uploads_module_1 = require("./uploads/uploads.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const office_locations_module_1 = require("./office-locations/office-locations.module");
const office_boy_staff_module_1 = require("./office-boy-staff/office-boy-staff.module");
const attendance_module_1 = require("./attendance/attendance.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '../.env'],
            }),
            cloudinary_module_1.CloudinaryModule,
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            sms_module_1.SmsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            branches_module_1.BranchesModule,
            entities_module_1.EntitiesModule,
            departments_module_1.DepartmentsModule,
            vendors_module_1.VendorsModule,
            requests_module_1.RequestsModule,
            courier_module_1.CourierModule,
            assets_module_1.AssetsModule,
            joining_kit_module_1.JoiningKitModule,
            expenses_module_1.ExpensesModule,
            id_cards_module_1.IdCardsModule,
            amc_module_1.AmcModule,
            seating_module_1.SeatingModule,
            brochures_module_1.BrochuresModule,
            pg_records_module_1.PgRecordsModule,
            notifications_module_1.NotificationsModule,
            audit_logs_module_1.AuditLogsModule,
            reports_module_1.ReportsModule,
            imports_module_1.ImportsModule,
            uploads_module_1.UploadsModule,
            dashboard_module_1.DashboardModule,
            office_locations_module_1.OfficeLocationsModule,
            office_boy_staff_module_1.OfficeBoyStaffModule,
            attendance_module_1.AttendanceModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map