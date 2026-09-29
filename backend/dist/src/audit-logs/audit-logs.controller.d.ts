import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private service;
    constructor(service: AuditLogsService);
    findAll(module?: string, userId?: string, limit?: string): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        module: string;
        recordId: string | null;
        details: string | null;
    })[]>;
}
