export declare function parseEmailOrPhone(value: string): {
    email: string;
    phone?: string;
};
export declare function isEmailValue(value: string): boolean;
export declare function isSystemGeneratedEmail(email?: string | null): boolean;
