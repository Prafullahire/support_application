import { AmcStatus } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAmcDto, UpdateAmcDto } from './dto/amc.dto';
export declare class AmcService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(branchId?: string, status?: AmcStatus): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
        } | null;
        vendor: {
            name: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AmcStatus;
        vendorId: string | null;
        location: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        startDate: Date;
        endDate: Date;
        documentUrl: string | null;
        reminderDays: number;
        emailNotification: boolean;
    })[]>;
    findOne(id: string): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        vendor: {
            name: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AmcStatus;
        vendorId: string | null;
        location: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        startDate: Date;
        endDate: Date;
        documentUrl: string | null;
        reminderDays: number;
        emailNotification: boolean;
    }>;
    create(dto: CreateAmcDto): import(".prisma/client").Prisma.Prisma__AmcRecordClient<{
        branch: {
            name: string;
            id: string;
        } | null;
        vendor: {
            name: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AmcStatus;
        vendorId: string | null;
        location: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        startDate: Date;
        endDate: Date;
        documentUrl: string | null;
        reminderDays: number;
        emailNotification: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateAmcDto): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        vendor: {
            name: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AmcStatus;
        vendorId: string | null;
        location: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        startDate: Date;
        endDate: Date;
        documentUrl: string | null;
        reminderDays: number;
        emailNotification: boolean;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AmcStatus;
        vendorId: string | null;
        location: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        startDate: Date;
        endDate: Date;
        documentUrl: string | null;
        reminderDays: number;
        emailNotification: boolean;
    }>;
    findExpiring(days?: number, branchId?: string): Promise<{
        expiringSoon: ({
            branch: {
                name: string;
                id: string;
            } | null;
            vendor: {
                name: string;
                id: string;
            } | null;
        } & {
            description: string | null;
            title: string;
            branchId: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AmcStatus;
            vendorId: string | null;
            location: string | null;
            amount: import("@prisma/client/runtime/library").Decimal | null;
            startDate: Date;
            endDate: Date;
            documentUrl: string | null;
            reminderDays: number;
            emailNotification: boolean;
        })[];
        expired: ({
            branch: {
                name: string;
                id: string;
            } | null;
            vendor: {
                name: string;
                id: string;
            } | null;
        } & {
            description: string | null;
            title: string;
            branchId: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AmcStatus;
            vendorId: string | null;
            location: string | null;
            amount: import("@prisma/client/runtime/library").Decimal | null;
            startDate: Date;
            endDate: Date;
            documentUrl: string | null;
            reminderDays: number;
            emailNotification: boolean;
        })[];
    }>;
    private include;
}
