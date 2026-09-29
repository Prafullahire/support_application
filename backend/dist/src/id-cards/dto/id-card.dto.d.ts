export declare class CreateIdCardDto {
    cardNumber: string;
    branchId?: string;
    receivedDate?: string;
}
export declare class UpdateIdCardDto {
    cardNumber?: string;
    branchId?: string;
    isAvailable?: boolean;
    receivedDate?: string;
}
export declare class AssignIdCardDto {
    assignedToId: string;
}
