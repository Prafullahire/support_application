import { NotificationType } from '../../common/enums';
export declare class CreateNotificationDto {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
}
export declare class MarkReadDto {
    isRead?: boolean;
}
