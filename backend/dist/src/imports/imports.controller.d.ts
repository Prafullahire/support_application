import { ImportsService } from './imports.service';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class ImportsController {
    private service;
    constructor(service: ImportsService);
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
    upload(file: Express.Multer.File, module: string, branchId: string | undefined, user: ScopedUser): Promise<{
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
}
