export declare function isValidQueryValue(value?: string): value is string;
export declare function parseOptionalDate(value?: string): Date | undefined;
export declare function buildExpenseDateFilter(startDate?: string, endDate?: string): {
    expenseDate?: undefined;
} | {
    expenseDate: {
        lte?: Date | undefined;
        gte?: Date | undefined;
    };
};
