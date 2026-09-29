import { CourierStatus } from '../../common/enums';
export declare class CreateCourierDto {
    pickupAddress: string;
    deliveryAddress: string;
    recipientName?: string;
    recipientPhone?: string;
    description?: string;
    vendorId?: string;
    branchId?: string;
    pickupDate?: string;
}
export declare class UpdateCourierDto {
    pickupAddress?: string;
    deliveryAddress?: string;
    recipientName?: string;
    recipientPhone?: string;
    description?: string;
    vendorId?: string;
    branchId?: string;
    trackingNumber?: string;
    pickupDate?: string;
    deliveryDate?: string;
}
export declare class UpdateCourierStatusDto {
    status: CourierStatus;
    trackingNumber?: string;
    deliveryDate?: string;
}
