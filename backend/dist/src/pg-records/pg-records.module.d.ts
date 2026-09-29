import { OnModuleInit } from '@nestjs/common';
import { PgReminderService } from './pg-reminder.service';
export declare class PgRecordsModule implements OnModuleInit {
    private readonly reminderService;
    constructor(reminderService: PgReminderService);
    onModuleInit(): void;
}
