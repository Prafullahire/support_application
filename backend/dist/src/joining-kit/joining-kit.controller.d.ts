import { JoiningKitService } from './joining-kit.service';
import { CreateJoiningKitItemDto, IssueJoiningKitDto, ReturnJoiningKitDto, UpdateJoiningKitItemDto, UpsertJoiningKitStockDto } from './dto/joining-kit.dto';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class JoiningKitController {
    private service;
    constructor(service: JoiningKitService);
    findAllItems(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOneItem(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createItem(dto: CreateJoiningKitItemDto): import(".prisma/client").Prisma.Prisma__JoiningKitItemClient<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateItem(id: string, dto: UpdateJoiningKitItemDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllStock(user: ScopedUser, branchId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
        } | null;
        item: {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        itemId: string;
        quantity: number;
        minStock: number;
    })[]>;
    upsertStock(dto: UpsertJoiningKitStockDto): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        item: {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        itemId: string;
        quantity: number;
        minStock: number;
    }>;
    findAllIssues(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            firstName: string;
            lastName: string;
            id: string;
        };
        items: ({
            item: {
                name: string;
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            itemId: string;
            quantity: number;
            issueId: string;
        })[];
    } & {
        branchId: string | null;
        joiningDate: Date | null;
        id: string;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        employeeName: string | null;
        location: string | null;
        notes: string | null;
        returnedAt: Date | null;
        issueNumber: string;
        issuedAt: Date;
        isReturned: boolean;
    })[]>;
    issueKit(dto: IssueJoiningKitDto): Promise<{
        user: {
            firstName: string;
            lastName: string;
            id: string;
        };
        items: ({
            item: {
                name: string;
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            itemId: string;
            quantity: number;
            issueId: string;
        })[];
    } & {
        branchId: string | null;
        joiningDate: Date | null;
        id: string;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        employeeName: string | null;
        location: string | null;
        notes: string | null;
        returnedAt: Date | null;
        issueNumber: string;
        issuedAt: Date;
        isReturned: boolean;
    }>;
    returnKit(id: string, dto: ReturnJoiningKitDto): Promise<{
        branchId: string | null;
        joiningDate: Date | null;
        id: string;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        employeeName: string | null;
        location: string | null;
        notes: string | null;
        returnedAt: Date | null;
        issueNumber: string;
        issuedAt: Date;
        isReturned: boolean;
    }>;
}
