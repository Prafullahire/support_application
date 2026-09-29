import { ExpensesService } from './expenses.service';
import { CreateExpenseCategoryDto, CreateExpenseDto, ExpenseFilterDto, UpdateExpenseCategoryDto, UpdateExpenseDto } from './dto/expense.dto';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class ExpensesController {
    private service;
    constructor(service: ExpensesService);
    findAll(user: ScopedUser, filters: ExpenseFilterDto): import(".prisma/client").Prisma.PrismaPromise<({
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
        amount: import("@prisma/client/runtime/library").Decimal;
        entityId: string | null;
        billUrl: string | null;
        invoiceUrl: string | null;
    })[]>;
    getSummary(user: ScopedUser, filters: ExpenseFilterDto): Promise<{
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
    findAllCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createCategory(dto: CreateExpenseCategoryDto): import(".prisma/client").Prisma.Prisma__ExpenseCategoryClient<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateCategory(id: string, dto: UpdateExpenseCategoryDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string, user: ScopedUser): Promise<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        entityId: string | null;
        billUrl: string | null;
        invoiceUrl: string | null;
    }>;
    create(dto: CreateExpenseDto, userId: string): import(".prisma/client").Prisma.Prisma__ExpenseClient<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        entityId: string | null;
        billUrl: string | null;
        invoiceUrl: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateExpenseDto, user: ScopedUser): Promise<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        entityId: string | null;
        billUrl: string | null;
        invoiceUrl: string | null;
    }>;
    remove(id: string, user: ScopedUser): Promise<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        entityId: string | null;
        billUrl: string | null;
        invoiceUrl: string | null;
    }>;
}
