import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsController {
    private service;
    constructor(service: NotificationsService);
    findAll(userId: string, unreadOnly?: string): import(".prisma/client").Prisma.PrismaPromise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
    markAllRead(userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    findOne(id: string, userId: string): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        isRead: boolean;
    }>;
    create(dto: CreateNotificationDto): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        isRead: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    markRead(id: string, userId: string): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        isRead: boolean;
    }>;
}
