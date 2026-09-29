import { AttendanceCorrectionStatus, UserRole } from '../common/enums';
import { ScopedUser } from '../common/utils/branch-scope.util';
import { AttendanceService } from './attendance.service';
import { AttendanceCorrectionService } from './attendance-correction.service';
import { AttendanceFilterDto, OfficeBoyLoginDto, OfficeBoyLogoutDto, OfficeBoyCheckInDto } from './dto/attendance.dto';
import { CreateAttendanceCorrectionDto, ReviewAttendanceCorrectionDto } from './dto/attendance-correction.dto';
export declare class AttendanceController {
    private service;
    private correctionService;
    constructor(service: AttendanceService, correctionService: AttendanceCorrectionService);
    officeBoyLogin(dto: OfficeBoyLoginDto): Promise<unknown>;
    officeBoyCheckIn(userId: string, dto: OfficeBoyCheckInDto): Promise<unknown>;
    officeBoyLogout(userId: string, dto: OfficeBoyLogoutDto): Promise<unknown>;
    getDashboard(userId: string): Promise<unknown>;
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
    getAll(filters: AttendanceFilterDto): Promise<{
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
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        userId: string;
        action: import(".prisma/client").$Enums.AttendanceActivityType;
        distanceMeters: number | null;
    })[]>;
    createCorrection(userId: string, dto: CreateAttendanceCorrectionDto): Promise<{
        id: string;
        attendanceId: string;
        userId: string;
        requestType: any;
        requestTypeLabel: string;
        comments: string;
        status: any;
        reviewedAt: Date | null;
        adminNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        staffName: string;
        staffEmployeeId: string | null;
        staffPhone: string | null;
        attendance: {
            id: string;
            attendanceDate: Date;
            loginTime: Date | null;
            logoutTime: Date | null;
            workingDurationMinutes: number | null;
            status: string;
            approvedCorrectionType: any;
            branch: {
                id: string;
                name: string;
            } | null;
            location: {
                id: string;
                name: string;
            } | null;
        };
        reviewedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    }>;
    getMyCorrections(userId: string): Promise<{
        id: string;
        attendanceId: string;
        userId: string;
        requestType: any;
        requestTypeLabel: string;
        comments: string;
        status: any;
        reviewedAt: Date | null;
        adminNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        staffName: string;
        staffEmployeeId: string | null;
        staffPhone: string | null;
        attendance: {
            id: string;
            attendanceDate: Date;
            loginTime: Date | null;
            logoutTime: Date | null;
            workingDurationMinutes: number | null;
            status: string;
            approvedCorrectionType: any;
            branch: {
                id: string;
                name: string;
            } | null;
            location: {
                id: string;
                name: string;
            } | null;
        };
        reviewedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    }[]>;
    getAllCorrections(user: ScopedUser, status?: AttendanceCorrectionStatus, branchId?: string): Promise<{
        id: string;
        attendanceId: string;
        userId: string;
        requestType: any;
        requestTypeLabel: string;
        comments: string;
        status: any;
        reviewedAt: Date | null;
        adminNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        staffName: string;
        staffEmployeeId: string | null;
        staffPhone: string | null;
        attendance: {
            id: string;
            attendanceDate: Date;
            loginTime: Date | null;
            logoutTime: Date | null;
            workingDurationMinutes: number | null;
            status: string;
            approvedCorrectionType: any;
            branch: {
                id: string;
                name: string;
            } | null;
            location: {
                id: string;
                name: string;
            } | null;
        };
        reviewedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    }[]>;
    getCorrection(id: string, userId: string, role: UserRole): Promise<{
        id: string;
        attendanceId: string;
        userId: string;
        requestType: any;
        requestTypeLabel: string;
        comments: string;
        status: any;
        reviewedAt: Date | null;
        adminNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        staffName: string;
        staffEmployeeId: string | null;
        staffPhone: string | null;
        attendance: {
            id: string;
            attendanceDate: Date;
            loginTime: Date | null;
            logoutTime: Date | null;
            workingDurationMinutes: number | null;
            status: string;
            approvedCorrectionType: any;
            branch: {
                id: string;
                name: string;
            } | null;
            location: {
                id: string;
                name: string;
            } | null;
        };
        reviewedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    }>;
    approveCorrection(id: string, adminId: string, dto: ReviewAttendanceCorrectionDto): Promise<{
        id: string;
        attendanceId: string;
        userId: string;
        requestType: any;
        requestTypeLabel: string;
        comments: string;
        status: any;
        reviewedAt: Date | null;
        adminNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        staffName: string;
        staffEmployeeId: string | null;
        staffPhone: string | null;
        attendance: {
            id: string;
            attendanceDate: Date;
            loginTime: Date | null;
            logoutTime: Date | null;
            workingDurationMinutes: number | null;
            status: string;
            approvedCorrectionType: any;
            branch: {
                id: string;
                name: string;
            } | null;
            location: {
                id: string;
                name: string;
            } | null;
        };
        reviewedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    }>;
    rejectCorrection(id: string, adminId: string, dto: ReviewAttendanceCorrectionDto): Promise<{
        id: string;
        attendanceId: string;
        userId: string;
        requestType: any;
        requestTypeLabel: string;
        comments: string;
        status: any;
        reviewedAt: Date | null;
        adminNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        staffName: string;
        staffEmployeeId: string | null;
        staffPhone: string | null;
        attendance: {
            id: string;
            attendanceDate: Date;
            loginTime: Date | null;
            logoutTime: Date | null;
            workingDurationMinutes: number | null;
            status: string;
            approvedCorrectionType: any;
            branch: {
                id: string;
                name: string;
            } | null;
            location: {
                id: string;
                name: string;
            } | null;
        };
        reviewedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    }>;
}
