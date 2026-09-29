export declare class CreateBrochureStockDto {
    name: string;
    branchId?: string;
    quantity: number;
    minStock?: number;
}
export declare class UpdateBrochureStockDto {
    name?: string;
    branchId?: string;
    quantity?: number;
    minStock?: number;
}
export declare class IssueBrochureDto {
    stockId: string;
    userId: string;
    quantity: number;
    notes?: string;
}
