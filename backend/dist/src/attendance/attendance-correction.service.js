"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceCorrectionService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../common/enums");
const roles_constants_1 = require("../common/constants/roles.constants");
const branch_scope_util_1 = require("../common/utils/branch-scope.util");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const attendance_correction_util_1 = require("./attendance-correction.util");
let AttendanceCorrectionService = class AttendanceCorrectionService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(userId, dto) {
        const attendance = await this.prisma.officeBoyAttendance.findUnique({
            where: { id: dto.attendanceId },
            include: {
                user: { select: { firstName: true, lastName: true } },
            },
        });
        if (!attendance || attendance.userId !== userId) {
            throw new common_1.NotFoundException('Attendance record not found');
        }
        if (!attendance.loginTime) {
            throw new common_1.BadRequestException('No attendance data available for this date');
        }
        const existingPending = await this.prisma.attendanceCorrectionRequest.findFirst({
            where: {
                attendanceId: dto.attendanceId,
                status: enums_1.AttendanceCorrectionStatus.PENDING,
            },
        });
        if (existingPending) {
            throw new common_1.BadRequestException('A correction request is already pending for this date');
        }
        const request = await this.prisma.attendanceCorrectionRequest.create({
            data: {
                attendanceId: dto.attendanceId,
                userId,
                requestType: dto.requestType,
                comments: dto.comments.trim(),
            },
            include: this.requestInclude(),
        });
        await this.notifyAdmins(request, attendance);
        return this.formatRequest(request);
    }
    async findMyRequests(userId) {
        const requests = await this.prisma.attendanceCorrectionRequest.findMany({
            where: { userId },
            include: this.requestInclude(),
            orderBy: { createdAt: 'desc' },
        });
        return requests.map((r) => this.formatRequest(r));
    }
    async findOne(id, userId, role) {
        const request = await this.prisma.attendanceCorrectionRequest.findUnique({
            where: { id },
            include: this.requestInclude(),
        });
        if (!request) {
            throw new common_1.NotFoundException('Correction request not found');
        }
        if (!(0, roles_constants_1.isPrivilegedAdmin)(role) && request.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.formatRequest(request);
    }
    async findAllForAdmin(user, status, requestedBranchId) {
        const scope = (0, branch_scope_util_1.resolveBranchFilter)(user, requestedBranchId);
        const requests = await this.prisma.attendanceCorrectionRequest.findMany({
            where: {
                ...(status ? { status } : {}),
                ...(scope.branchId ? { attendance: { branchId: scope.branchId } } : {}),
            },
            include: this.requestInclude(),
            orderBy: { createdAt: 'desc' },
        });
        return requests.map((r) => this.formatRequest(r));
    }
    async approve(id, adminId, dto) {
        const request = await this.prisma.attendanceCorrectionRequest.findUnique({
            where: { id },
            include: this.requestInclude(),
        });
        if (!request) {
            throw new common_1.NotFoundException('Correction request not found');
        }
        if (request.status !== enums_1.AttendanceCorrectionStatus.PENDING) {
            throw new common_1.BadRequestException('This request has already been reviewed');
        }
        const updatedStatus = (0, attendance_correction_util_1.mapCorrectionTypeToAttendanceStatus)(request.requestType);
        const [updatedRequest] = await this.prisma.$transaction([
            this.prisma.attendanceCorrectionRequest.update({
                where: { id },
                data: {
                    status: enums_1.AttendanceCorrectionStatus.APPROVED,
                    reviewedById: adminId,
                    reviewedAt: new Date(),
                    adminNotes: dto.adminNotes?.trim() || null,
                },
                include: this.requestInclude(),
            }),
            this.prisma.officeBoyAttendance.update({
                where: { id: request.attendanceId },
                data: {
                    status: updatedStatus,
                    approvedCorrectionType: request.requestType,
                },
            }),
        ]);
        await this.notificationsService.create({
            userId: request.userId,
            title: 'Attendance correction approved',
            message: `Your request for ${(0, attendance_correction_util_1.getAttendanceCorrectionTypeLabel)(request.requestType)} on ${this.formatDate(request.attendance.attendanceDate)} was approved.`,
            type: enums_1.NotificationType.ATTENDANCE_CORRECTION_APPROVED,
            link: '/office-boy/dashboard/checklist',
        });
        return this.formatRequest(updatedRequest);
    }
    async reject(id, adminId, dto) {
        const request = await this.prisma.attendanceCorrectionRequest.findUnique({
            where: { id },
            include: this.requestInclude(),
        });
        if (!request) {
            throw new common_1.NotFoundException('Correction request not found');
        }
        if (request.status !== enums_1.AttendanceCorrectionStatus.PENDING) {
            throw new common_1.BadRequestException('This request has already been reviewed');
        }
        const updatedRequest = await this.prisma.attendanceCorrectionRequest.update({
            where: { id },
            data: {
                status: enums_1.AttendanceCorrectionStatus.REJECTED,
                reviewedById: adminId,
                reviewedAt: new Date(),
                adminNotes: dto.adminNotes?.trim() || null,
            },
            include: this.requestInclude(),
        });
        await this.notificationsService.create({
            userId: request.userId,
            title: 'Attendance correction rejected',
            message: `Your request for ${(0, attendance_correction_util_1.getAttendanceCorrectionTypeLabel)(request.requestType)} on ${this.formatDate(request.attendance.attendanceDate)} was rejected.${dto.adminNotes ? ` Note: ${dto.adminNotes}` : ''}`,
            type: enums_1.NotificationType.ATTENDANCE_CORRECTION_REJECTED,
            link: '/office-boy/dashboard/checklist',
        });
        return this.formatRequest(updatedRequest);
    }
    async notifyAdmins(request, attendance) {
        const admins = await this.prisma.user.findMany({
            where: {
                isActive: true,
                OR: [
                    { role: enums_1.UserRole.SUPER_ADMIN },
                    { role: enums_1.UserRole.ADMIN, branchId: attendance.branchId },
                ],
            },
            select: { id: true },
        });
        const staffName = `${attendance.user.firstName} ${attendance.user.lastName}`;
        const dateLabel = this.formatDate(attendance.attendanceDate);
        const typeLabel = (0, attendance_correction_util_1.getAttendanceCorrectionTypeLabel)(request.requestType);
        await Promise.all(admins.map((admin) => this.notificationsService.create({
            userId: admin.id,
            title: 'Attendance correction request',
            message: `${staffName} requested "${typeLabel}" for ${dateLabel}. Comments: ${request.comments}`,
            type: enums_1.NotificationType.ATTENDANCE_CORRECTION_REQUEST,
            link: '/attendance-corrections',
        })));
    }
    requestInclude() {
        return {
            attendance: {
                include: {
                    branch: { select: { id: true, name: true } },
                    location: { select: { id: true, name: true } },
                },
            },
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    employeeId: true,
                    phone: true,
                },
            },
            reviewedBy: {
                select: { id: true, firstName: true, lastName: true },
            },
        };
    }
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }
    formatRequest(request) {
        return {
            id: request.id,
            attendanceId: request.attendanceId,
            userId: request.userId,
            requestType: request.requestType,
            requestTypeLabel: (0, attendance_correction_util_1.getAttendanceCorrectionTypeLabel)(request.requestType),
            comments: request.comments,
            status: request.status,
            reviewedAt: request.reviewedAt,
            adminNotes: request.adminNotes,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            staffName: `${request.user.firstName} ${request.user.lastName}`,
            staffEmployeeId: request.user.employeeId,
            staffPhone: request.user.phone,
            attendance: {
                id: request.attendance.id,
                attendanceDate: request.attendance.attendanceDate,
                loginTime: request.attendance.loginTime,
                logoutTime: request.attendance.logoutTime,
                workingDurationMinutes: request.attendance.workingDurationMinutes,
                status: request.attendance.status,
                approvedCorrectionType: request.attendance.approvedCorrectionType,
                branch: request.attendance.branch,
                location: request.attendance.location,
            },
            reviewedBy: request.reviewedBy,
        };
    }
};
exports.AttendanceCorrectionService = AttendanceCorrectionService;
exports.AttendanceCorrectionService = AttendanceCorrectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], AttendanceCorrectionService);
//# sourceMappingURL=attendance-correction.service.js.map