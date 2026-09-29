export declare class CreateExpenseDto {
    title: string;
    amount: number;
    description?: string;
    expenseDate: string;
    categoryId?: string;
    vendorId?: string;
    entityId?: string;
    branchId?: string;
    billUrl?: string;
    invoiceUrl?: string;
}
export declare class UpdateExpenseDto {
    title?: string;
    amount?: number;
    description?: string;
    expenseDate?: string;
    categoryId?: string;
    vendorId?: string;
    entityId?: string;
    branchId?: string;
    billUrl?: string;
    invoiceUrl?: string;
}
export declare class ExpenseFilterDto {
    entityId?: string;
    branchId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: 'expenseDate' | 'amount' | 'title' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export declare class CreateExpenseCategoryDto {
    name: string;
}
export declare class UpdateExpenseCategoryDto {
    name?: string;
    isActive?: boolean;
}
