import { Prisma } from '@prisma/client';
import { ScopedUser } from '../common/utils/branch-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseCategoryDto, CreateExpenseDto, ExpenseFilterDto, UpdateExpenseCategoryDto, UpdateExpenseDto } from './dto/expense.dto';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: ScopedUser, filters?: ExpenseFilterDto): Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
            code: string;
        } | null;
        entity: {
            name: string;
            id: string;
            code: string;
        } | null;
        vendor: {
            name: string;
            id: string;
        } | null;
        createdBy: {
            firstName: string;
            lastName: string;
            id: string;
        };
        category: {
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
        createdById: string;
        vendorId: string | null;
        categoryId: string | null;
        expenseDate: Date;
        amount: Prisma.Decimal;
        entityId: string | null;
        billUrl: string | null;
        invoiceUrl: string | null;
    })[]>;
    getSummary(user: ScopedUser, filters?: ExpenseFilterDto): Promise<{
        grandTotal: number;
        totalCount: number;
        entityWise: {
            entityId: string;
            entityName: string;
            total: number;
            count: number;
            branches: {
                branchId: string;
                branchName: string;
                total: number;
                count: number;
            }[];
        }[];
        branchWise: {
            branchId: string;
            branchName: string;
            total: number;
            count: number;
        }[];
        allEntities: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        }[];
        allBranches: {
            name: string;
            address: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            city: string | null;
        }[];
    }>;
    findOne(id: string, userId: string, role: ScopedUser['role']): Promise<{
        branch: {
            name: string;
            id: string;
            code: string;
        } | null;
        entity: {
            name: string;
            id: string;
            code: string;
        } | null;
        vendor: {
            name: string;
            id: string;
        } | null;
        createdBy: {
            firstName: string;
            lastName: string;
            id: string;
        };
        category: {
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
        createdById: string;
        vendorId: string | null;
        categoryId: string | null;
        expenseDate: Date;
        amount: Prisma.Decimal;
        entityId: string | null;
        billUrl: string | null;
        invoiceUrl: string | null;
    }>;
    create(dto: CreateExpenseDto, userId: string): Prisma.Prisma__ExpenseClient<{
        branch: {
            name: string;
            id: string;
            code: string;
        } | null;
        entity: {
            name: string;
            id: string;
            code: string;
        } | null;
        vendor: {
            name: string;
            id: string;
        } | null;
        createdBy: {
            firstName: string;
            lastName: string;
            id: string;
        };
        category: {
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
        createdById: string;
        vendorId: string | null;
        categoryId: string | null;
        expenseDate: Date;
        amount: Prisma.Decimal;
        entityId: string | null;
        billUrl: string | null;
        invoiceUrl: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateExpenseDto, userId: string, role: ScopedUser['role']): Promise<{
        branch: {
            name: string;
            id: string;
            code: string;
        } | null;
        entity: {
            name: string;
            id: string;
            code: string;
        } | null;
        vendor: {
            name: string;
            id: string;
        } | null;
        createdBy: {
            firstName: string;
            lastName: string;
            id: string;
        };
        category: {
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
        createdById: string;
        vendorId: string | null;
        categoryId: string | null;
        expenseDate: Date;
        amount: Prisma.Decimal;
        entityId: string | null;
        billUrl: string | null;
        invoiceUrl: string | null;
    }>;
    remove(id: string, userId: string, role: ScopedUser['role']): Promise<{
        description: string | null;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        vendorId: string | null;
        categoryId: string | null;
        expenseDate: Date;
        amount: Prisma.Decimal;
        entityId: string | null;
        billUrl: string | null;
        invoiceUrl: string | null;
    }>;
    findAllCategories(): Prisma.PrismaPromise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createCategory(dto: CreateExpenseCategoryDto): Prisma.Prisma__ExpenseCategoryClient<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    updateCategory(id: string, dto: UpdateExpenseCategoryDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private include;
}
