import { AuthService } from './auth.service';
import { RegisterBody, LoginBody } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: RegisterBody): Promise<{
        user: Record<string, unknown>;
        accessToken: string;
        refreshToken: string;
    }>;
    getRegisterBranches(): Promise<{
        name: string;
        id: string;
        code: string;
    }[]>;
    getRegisterOfficeLocations(branchId?: string): Promise<{
        name: string;
        branchId: string;
        id: string;
    }[]>;
    login(body: LoginBody): Promise<{
        user: Record<string, unknown>;
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(body: {
        refreshToken?: string;
    }): Promise<{
        user: Record<string, unknown>;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(body: {
        refreshToken?: string;
    }): Promise<{
        message: string;
    }>;
    forgotPassword(body: {
        email?: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token?: string;
        password?: string;
    }): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        branch: {
            name: string;
            id: string;
            code: string;
        } | null;
        department: {
            name: string;
            id: string;
        } | null;
        officeLocation: {
            name: string;
            id: string;
            allowedRadiusMeters: number;
        } | null;
        email: string;
        phone: string | null;
        firstName: string;
        lastName: string;
        branchId: string | null;
        officeLocationId: string | null;
        joiningDate: Date | null;
        leavingDate: Date | null;
        address: string | null;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        departmentId: string | null;
        employeeId: string | null;
        isActive: boolean;
        createdAt: Date;
    } | null>;
}
