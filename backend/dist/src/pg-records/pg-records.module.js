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
exports.PgRecordsModule = void 0;
const common_1 = require("@nestjs/common");
const pg_records_service_1 = require("./pg-records.service");
const pg_records_controller_1 = require("./pg-records.controller");
const pg_reminder_service_1 = require("./pg-reminder.service");
const mail_module_1 = require("../mail/mail.module");
let PgRecordsModule = class PgRecordsModule {
    constructor(reminderService) {
        this.reminderService = reminderService;
    }
    onModuleInit() {
        this.reminderService.sendExpiryReminders().catch(() => { });
        setInterval(() => this.reminderService.sendExpiryReminders().catch(() => { }), 24 * 60 * 60 * 1000);
    }
};
exports.PgRecordsModule = PgRecordsModule;
exports.PgRecordsModule = PgRecordsModule = __decorate([
    (0, common_1.Module)({
        imports: [mail_module_1.MailModule],
        controllers: [pg_records_controller_1.PgRecordsController],
        providers: [pg_records_service_1.PgRecordsService, pg_reminder_service_1.PgReminderService],
        exports: [pg_records_service_1.PgRecordsService],
    }),
    __metadata("design:paramtypes", [pg_reminder_service_1.PgReminderService])
], PgRecordsModule);
//# sourceMappingURL=pg-records.module.js.map