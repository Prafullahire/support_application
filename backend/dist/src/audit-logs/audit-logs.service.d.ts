import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(module?: string, userId?: string, limit?: number): import(".prisma/client").Prisma.PrismaPromise<({
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
