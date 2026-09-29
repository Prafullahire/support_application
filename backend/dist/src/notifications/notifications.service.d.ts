import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, unreadOnly?: boolean): import(".prisma/client").Prisma.PrismaPromise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        isRead: boolean;
    }[]>;
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
    markAllRead(userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    getUnreadCount(userId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
}
