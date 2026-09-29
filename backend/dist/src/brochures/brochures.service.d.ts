import { PrismaService } from '../prisma/prisma.service';
import { CreateBrochureStockDto, IssueBrochureDto, UpdateBrochureStockDto } from './dto/brochure.dto';
export declare class BrochuresService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllStock(branchId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        minStock: number;
    })[]>;
    findOneStock(id: string): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        minStock: number;
    }>;
    createStock(dto: CreateBrochureStockDto): import(".prisma/client").Prisma.Prisma__BrochureStockClient<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        minStock: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateStock(id: string, dto: UpdateBrochureStockDto): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        minStock: number;
    }>;
    removeStock(id: string): Promise<{
        name: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        minStock: number;
    }>;
    findAllIssues(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            firstName: string;
            lastName: string;
            id: string;
        };
        stock: {
            name: string;
            branchId: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            minStock: number;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        notes: string | null;
        quantity: number;
        issueNumber: string;
        issuedAt: Date;
        stockId: string;
    })[]>;
    issueBrochure(dto: IssueBrochureDto): Promise<{
        user: {
            firstName: string;
            lastName: string;
            id: string;
        };
        stock: {
            name: string;
            branchId: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            minStock: number;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        notes: string | null;
        quantity: number;
        issueNumber: string;
        issuedAt: Date;
        stockId: string;
    }>;
}
