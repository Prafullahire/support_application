import { PgStatus } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePgRecordDto, UpdatePgRecordDto } from './dto/pg-record.dto';
export declare class PgRecordsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(branchId?: string, status?: PgStatus): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        branchId: string | null;
        address: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PgStatus;
        employeeName: string;
        location: string | null;
        notes: string | null;
        reminderDays: number;
        rentAmount: import("@prisma/client/runtime/library").Decimal;
        agreementStart: Date;
        agreementEnd: Date;
        contactPhone: string | null;
        raisedBy: string | null;
        fileAttachment: string | null;
    })[]>;
    findOne(id: string): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        branchId: string | null;
        address: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PgStatus;
        employeeName: string;
        location: string | null;
        notes: string | null;
        reminderDays: number;
        rentAmount: import("@prisma/client/runtime/library").Decimal;
        agreementStart: Date;
        agreementEnd: Date;
        contactPhone: string | null;
        raisedBy: string | null;
        fileAttachment: string | null;
    }>;
    create(dto: CreatePgRecordDto): import(".prisma/client").Prisma.Prisma__PgRecordClient<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        branchId: string | null;
        address: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PgStatus;
        employeeName: string;
        location: string | null;
        notes: string | null;
        reminderDays: number;
        rentAmount: import("@prisma/client/runtime/library").Decimal;
        agreementStart: Date;
        agreementEnd: Date;
        contactPhone: string | null;
        raisedBy: string | null;
        fileAttachment: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdatePgRecordDto): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        branchId: string | null;
        address: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PgStatus;
        employeeName: string;
        location: string | null;
        notes: string | null;
        reminderDays: number;
        rentAmount: import("@prisma/client/runtime/library").Decimal;
        agreementStart: Date;
        agreementEnd: Date;
        contactPhone: string | null;
        raisedBy: string | null;
        fileAttachment: string | null;
    }>;
    remove(id: string): Promise<{
        branchId: string | null;
        address: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PgStatus;
        employeeName: string;
        location: string | null;
        notes: string | null;
        reminderDays: number;
        rentAmount: import("@prisma/client/runtime/library").Decimal;
        agreementStart: Date;
        agreementEnd: Date;
        contactPhone: string | null;
        raisedBy: string | null;
        fileAttachment: string | null;
    }>;
}
