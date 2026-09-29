import { PrismaService } from '../../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(userId: string | undefined, action: string, module: string, recordId?: string, details?: string): Promise<void>;
}
export declare class BaseCrudService<T extends {
    id: string;
}> {
    protected prisma: PrismaService;
    protected modelName: string;
    protected auditService?: AuditService | undefined;
    constructor(prisma: PrismaService, modelName: string, auditService?: AuditService | undefined);
    protected get model(): any;
    findAll(where?: Record<string, unknown>, include?: Record<string, unknown>): Promise<any>;
    findOne(id: string, include?: Record<string, unknown>): Promise<any>;
    create(data: Record<string, unknown>, userId?: string): Promise<any>;
    update(id: string, data: Record<string, unknown>, userId?: string): Promise<any>;
    remove(id: string, userId?: string): Promise<any>;
}
