import { UserRole } from '../common/enums';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { StatusNotificationService } from '../notifications/status-notification.service';
import { CreateRequestDto, UpdateRequestDto } from './dto/request.dto';
export declare class RequestsService {
    private prisma;
    private statusNotification;
    private config;
    constructor(prisma: PrismaService, statusNotification: StatusNotificationService, config: ConfigService);
    findAll(userId: string, role: UserRole, branchId?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    findOne(id: string, userId: string, role: UserRole): Promise<{
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
    update(id: string, dto: UpdateRequestDto, userId: string, role: UserRole): Promise<{
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
    remove(id: string, userId: string, role: UserRole): Promise<{
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
    private include;
}
