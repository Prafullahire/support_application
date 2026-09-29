import { PrismaService } from '../prisma/prisma.service';
export declare class ImportsService {
    private prisma;
    constructor(prisma: PrismaService);
    importFromXlsx(file: Express.Multer.File, module: string, userId: string, branchId?: string): Promise<{
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        module: string;
        createdBy: string | null;
        fileName: string;
        totalRows: number;
        successRows: number;
        failedRows: number;
        errors: string | null;
    }>;
    findAllJobs(): import(".prisma/client").Prisma.PrismaPromise<{
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        module: string;
        createdBy: string | null;
        fileName: string;
        totalRows: number;
        successRows: number;
        failedRows: number;
        errors: string | null;
    }[]>;
    findOneJob(id: string): import(".prisma/client").Prisma.Prisma__ImportJobClient<{
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        module: string;
        createdBy: string | null;
        fileName: string;
        totalRows: number;
        successRows: number;
        failedRows: number;
        errors: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    private importRow;
}
