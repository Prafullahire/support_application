import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AttendanceFilterDto, OfficeBoyCheckInDto, OfficeBoyLoginDto, OfficeBoyLogoutDto } from './dto/attendance.dto';
export declare class AttendanceService {
    private prisma;
    private authService;
    private cloudinary;
    constructor(prisma: PrismaService, authService: AuthService, cloudinary: CloudinaryService);
    officeBoyLogin(dto: OfficeBoyLoginDto): Promise<unknown>;
    private findOfficeBoyByLoginId;
    private ensureOfficeBoyLocation;
    officeBoyCheckIn(userId: string, dto: OfficeBoyCheckInDto): Promise<unknown>;
    private recordCheckIn;
    officeBoyLogout(userId: string, dto: OfficeBoyLogoutDto): Promise<unknown>;
    getMyDashboard(userId: string): Promise<unknown>;
    getMyHistory(userId: string, filters: AttendanceFilterDto): Promise<{
        id: string;
        attendanceDate: Date;
        loginTime: Date | null;
        logoutTime: Date | null;
        loginLatitude: number | null;
        loginLongitude: number | null;
        logoutLatitude: number | null;
        logoutLongitude: number | null;
        loginDistanceMeters: number | null;
        logoutDistanceMeters: number | null;
        workingDurationMinutes: number | null;
        totalWorkingMinutes: number;
        status: any;
        statusLabel: string;
        approvedCorrectionType: string | null;
        correctionRequest: {
            id: string;
            requestType: string;
            requestTypeLabel: string;
            comments: string;
            status: any;
            adminNotes: string | null;
            createdAt: Date;
        } | null;
        isLate: boolean;
        lateReason: string | null;
        isEarlyLeave: boolean;
        earlyLeaveReason: string | null;
        isSessionActive: boolean;
        loginPhotoUrl: string | null;
        logoutPhotoUrl: string | null;
        isDayComplete: boolean;
        canSignInAgain: boolean;
        branch: {
            id: string;
            name: string;
        } | null | undefined;
        location: {
            id: string;
            name: string;
        } | null | undefined;
        workingDurationFormatted: string | null;
    }[]>;
    getAllAttendance(filters: AttendanceFilterDto): Promise<{
        staffName: string;
        staffEmployeeId: string | null;
        staffEmail: string;
        staffPhone: string | null;
        id: string;
        attendanceDate: Date;
        loginTime: Date | null;
        logoutTime: Date | null;
        loginLatitude: number | null;
        loginLongitude: number | null;
        logoutLatitude: number | null;
        logoutLongitude: number | null;
        loginDistanceMeters: number | null;
        logoutDistanceMeters: number | null;
        workingDurationMinutes: number | null;
        totalWorkingMinutes: number;
        status: any;
        statusLabel: string;
        approvedCorrectionType: string | null;
        correctionRequest: {
            id: string;
            requestType: string;
            requestTypeLabel: string;
            comments: string;
            status: any;
            adminNotes: string | null;
            createdAt: Date;
        } | null;
        isLate: boolean;
        lateReason: string | null;
        isEarlyLeave: boolean;
        earlyLeaveReason: string | null;
        isSessionActive: boolean;
        loginPhotoUrl: string | null;
        logoutPhotoUrl: string | null;
        isDayComplete: boolean;
        canSignInAgain: boolean;
        branch: {
            id: string;
            name: string;
        } | null | undefined;
        location: {
            id: string;
            name: string;
        } | null | undefined;
        workingDurationFormatted: string | null;
    }[]>;
    getActivityLogs(userId?: string): Promise<({
        user: {
            firstName: string;
            lastName: string;
            employeeId: string | null;
        };
    } & {
        message: string | null;
        id: string;
        createdAt: Date;
        latitude: Prisma.Decimal | null;
        longitude: Prisma.Decimal | null;
        userId: string;
        action: import(".prisma/client").$Enums.AttendanceActivityType;
        distanceMeters: number | null;
    })[]>;
    private buildFilterWhere;
    private resolveDateFilter;
    private findTodayAttendance;
    private attendanceInclude;
    private formatAttendance;
    private uploadAttendancePhoto;
    private logActivity;
}
