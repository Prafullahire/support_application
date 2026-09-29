import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    private mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService, mailService: MailService);
    register(dto: RegisterDto): Promise<{
        user: Record<string, unknown>;
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: Record<string, unknown>;
        accessToken: string;
        refreshToken: string;
    }>;
    private findUserByEmailOrPhone;
    refresh(refreshToken: string): Promise<{
        user: Record<string, unknown>;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
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
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
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
    issueTokensForUser(userId: string): Promise<{
        user: Record<string, unknown>;
        accessToken: string;
        refreshToken: string;
    }>;
    private throwPasswordResetSchemaError;
    private generateTokens;
    private userSelect;
}
