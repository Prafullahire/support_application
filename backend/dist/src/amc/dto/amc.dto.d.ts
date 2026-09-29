import { AmcStatus } from '../../common/enums';
export declare class CreateAmcDto {
    title: string;
    vendorId?: string;
    branchId?: string;
    location?: string;
    startDate: string;
    endDate: string;
    amount?: number;
    description?: string;
    documentUrl?: string;
    reminderDays?: number;
    emailNotification?: boolean;
}
export declare class UpdateAmcDto {
    title?: string;
    vendorId?: string;
    branchId?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    amount?: number;
    description?: string;
    documentUrl?: string;
    status?: AmcStatus;
    reminderDays?: number;
    emailNotification?: boolean;
}
