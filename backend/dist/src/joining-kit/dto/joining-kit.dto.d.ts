export declare class CreateJoiningKitItemDto {
    name: string;
    description?: string;
}
export declare class UpdateJoiningKitItemDto {
    name?: string;
    description?: string;
    isActive?: boolean;
}
export declare class UpsertJoiningKitStockDto {
    itemId: string;
    branchId?: string;
    quantity: number;
    minStock?: number;
}
export declare class IssueKitItemDto {
    itemId: string;
    quantity: number;
}
export declare class IssueJoiningKitDto {
    userId: string;
    notes?: string;
    items: IssueKitItemDto[];
    employeeId?: string;
    employeeName?: string;
    location?: string;
    branchId?: string;
    joiningDate?: string;
}
export declare class ReturnJoiningKitDto {
    notes?: string;
}
