import { ConfigService } from '@nestjs/config';
import { UserRole } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';
import { StatusNotificationService } from '../notifications/status-notification.service';
import { CreateCourierDto, UpdateCourierDto, UpdateCourierStatusDto } from './dto/courier.dto';
export declare class CourierService {
    private prisma;
    private statusNotification;
    private config;
    constructor(prisma: PrismaService, statusNotification: StatusNotificationService, config: ConfigService);
    findAll(userId: string, role: UserRole, branchId?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    findOne(id: string, userId: string, role: UserRole): Promise<{
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
    update(id: string, dto: UpdateCourierDto, userId: string, role: UserRole): Promise<{
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
    updateStatus(id: string, dto: UpdateCourierStatusDto, userId: string, role: UserRole): Promise<{
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
    remove(id: string, userId: string, role: UserRole): Promise<{
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
    private notifyCourierStatusChange;
    private include;
}
