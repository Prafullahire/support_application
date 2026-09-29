import { UserRole } from '../common/enums';
import { CourierService } from './courier.service';
import { CreateCourierDto, UpdateCourierDto, UpdateCourierStatusDto } from './dto/courier.dto';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class CourierController {
    private service;
    constructor(service: CourierService);
    findAll(user: ScopedUser, branchId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
        } | null;
        vendor: {
            name: string;
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
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CourierStatus;
        createdById: string;
        pickupAddress: string;
        deliveryAddress: string;
        recipientName: string | null;
        recipientPhone: string | null;
        vendorId: string | null;
        pickupDate: Date | null;
        trackingNumber: string | null;
        deliveryDate: Date | null;
        requestNumber: string;
    })[]>;
    findOne(id: string, user: {
        id: string;
        role: UserRole;
    }): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        vendor: {
            name: string;
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
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CourierStatus;
        createdById: string;
        pickupAddress: string;
        deliveryAddress: string;
        recipientName: string | null;
        recipientPhone: string | null;
        vendorId: string | null;
        pickupDate: Date | null;
        trackingNumber: string | null;
        deliveryDate: Date | null;
        requestNumber: string;
    }>;
    create(dto: CreateCourierDto, userId: string): import(".prisma/client").Prisma.Prisma__CourierRequestClient<{
        branch: {
            name: string;
            id: string;
        } | null;
        vendor: {
            name: string;
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
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CourierStatus;
        createdById: string;
        pickupAddress: string;
        deliveryAddress: string;
        recipientName: string | null;
        recipientPhone: string | null;
        vendorId: string | null;
        pickupDate: Date | null;
        trackingNumber: string | null;
        deliveryDate: Date | null;
        requestNumber: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateCourierDto, user: {
        id: string;
        role: UserRole;
    }): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        vendor: {
            name: string;
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
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CourierStatus;
        createdById: string;
        pickupAddress: string;
        deliveryAddress: string;
        recipientName: string | null;
        recipientPhone: string | null;
        vendorId: string | null;
        pickupDate: Date | null;
        trackingNumber: string | null;
        deliveryDate: Date | null;
        requestNumber: string;
    }>;
    updateStatus(id: string, dto: UpdateCourierStatusDto, user: {
        id: string;
        role: UserRole;
    }): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        vendor: {
            name: string;
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
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CourierStatus;
        createdById: string;
        pickupAddress: string;
        deliveryAddress: string;
        recipientName: string | null;
        recipientPhone: string | null;
        vendorId: string | null;
        pickupDate: Date | null;
        trackingNumber: string | null;
        deliveryDate: Date | null;
        requestNumber: string;
    }>;
    remove(id: string, user: {
        id: string;
        role: UserRole;
    }): Promise<{
        description: string | null;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CourierStatus;
        createdById: string;
        pickupAddress: string;
        deliveryAddress: string;
        recipientName: string | null;
        recipientPhone: string | null;
        vendorId: string | null;
        pickupDate: Date | null;
        trackingNumber: string | null;
        deliveryDate: Date | null;
        requestNumber: string;
    }>;
}
