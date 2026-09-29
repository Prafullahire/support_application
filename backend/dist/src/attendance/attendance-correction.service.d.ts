import { AttendanceCorrectionStatus, UserRole } from '../common/enums';
import { ScopedUser } from '../common/utils/branch-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAttendanceCorrectionDto, ReviewAttendanceCorrectionDto } from './dto/attendance-correction.dto';
export declare class AttendanceCorrectionService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(userId: string, dto: CreateAttendanceCorrectionDto): Promise<{
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
    findMyRequests(userId: string): Promise<{
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
    findOne(id: string, userId: string, role: UserRole): Promise<{
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
    findAllForAdmin(user: ScopedUser, status?: AttendanceCorrectionStatus, requestedBranchId?: string): Promise<{
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
    approve(id: string, adminId: string, dto: ReviewAttendanceCorrectionDto): Promise<{
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
    reject(id: string, adminId: string, dto: ReviewAttendanceCorrectionDto): Promise<{
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
    private notifyAdmins;
    private requestInclude;
    private formatDate;
    private formatRequest;
}
