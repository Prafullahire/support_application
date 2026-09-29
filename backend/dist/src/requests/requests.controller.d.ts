import { UserRole } from '../common/enums';
import { RequestsService } from './requests.service';
import { CreateRequestDto, UpdateRequestDto } from './dto/request.dto';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class RequestsController {
    private service;
    constructor(service: RequestsService);
    findAll(user: ScopedUser, branchId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
        } | null;
        assignedTo: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        } | null;
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        description: string | null;
        type: string;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdById: string;
    })[]>;
    findOne(id: string, user: {
        id: string;
        role: UserRole;
    }): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        assignedTo: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        } | null;
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        description: string | null;
        type: string;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdById: string;
    }>;
    create(dto: CreateRequestDto, userId: string): import(".prisma/client").Prisma.Prisma__RequestClient<{
        branch: {
            name: string;
            id: string;
        } | null;
        assignedTo: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        } | null;
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        description: string | null;
        type: string;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdById: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateRequestDto, user: {
        id: string;
        role: UserRole;
    }): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        assignedTo: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        } | null;
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        description: string | null;
        type: string;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdById: string;
    }>;
    remove(id: string, user: {
        id: string;
        role: UserRole;
    }): Promise<{
        description: string | null;
        type: string;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdById: string;
    }>;
    assign(id: string, assignedToId: string, user: {
        id: string;
        role: UserRole;
    }): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        assignedTo: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        } | null;
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        description: string | null;
        type: string;
        title: string;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdById: string;
    }>;
}
