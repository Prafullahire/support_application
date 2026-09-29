export declare class RegisterDto {
    emailOrPhone: string;
    email?: string;
    phone?: string;
    password: string;
    firstName: string;
    lastName: string;
    branchId?: string;
    officeLocationId?: string;
    joiningDate?: string;
    leavingDate?: string;
    address?: string;
}
export declare class LoginDto {
    emailOrPhone: string;
    email?: string;
    phone?: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export type RegisterBody = {
    emailOrPhone?: string;
    email?: string;
    phone?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    branchId?: string;
    officeLocationId?: string;
    joiningDate?: string;
    leavingDate?: string;
    address?: string;
};
export type LoginBody = {
    emailOrPhone?: string;
    email?: string;
    phone?: string;
    password?: string;
};
