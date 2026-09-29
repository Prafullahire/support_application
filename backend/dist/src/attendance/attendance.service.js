"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const enums_1 = require("../common/enums");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const geo_util_1 = require("../common/utils/geo.util");
const attendance_correction_util_1 = require("./attendance-correction.util");
const office_boy_util_1 = require("../common/utils/office-boy.util");
const serialize_util_1 = require("../common/utils/serialize.util");
let AttendanceService = class AttendanceService {
    constructor(prisma, authService, cloudinary) {
        this.prisma = prisma;
        this.authService = authService;
        this.cloudinary = cloudinary;
    }
    async officeBoyLogin(dto) {
        if (dto.latitude == null || dto.longitude == null) {
            await this.logActivity(null, enums_1.AttendanceActivityType.LOGIN_LOCATION_PERMISSION_DENIED, dto, 'GPS coordinates missing');
            throw new common_1.BadRequestException('Location permission is required to login. Please enable location permission and try again.');
        }
        const user = await this.findOfficeBoyByLoginId(dto.loginId);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const validPassword = await bcrypt.compare(dto.password, user.password);
        if (!validPassword) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const officeBoyUser = await this.ensureOfficeBoyLocation(user);
        const existing = await this.findTodayAttendance(officeBoyUser.id);
        const loginNote = existing?.logoutTime
            ? 'Re-authenticated (attendance completed)'
            : existing?.isSessionActive
                ? 'Re-authenticated (session active)'
                : existing?.loginTime
                    ? 'Re-authenticated (awaiting sign out)'
                    : 'Login successful (awaiting sign in)';
        await this.logActivity(officeBoyUser.id, enums_1.AttendanceActivityType.LOGIN_SUCCESS, dto, loginNote);
        const tokens = await this.authService.issueTokensForUser(officeBoyUser.id);
        return (0, serialize_util_1.toJsonValue)({
            ...tokens,
            attendance: existing ? this.formatAttendance(existing) : null,
        });
    }
    async findOfficeBoyByLoginId(loginId) {
        const trimmed = loginId.trim();
        const normalizedPhone = (0, office_boy_util_1.normalizePhone)(trimmed);
        const direct = await this.prisma.user.findFirst({
            where: {
                role: enums_1.UserRole.OFFICE_BOY,
                OR: [
                    { email: trimmed },
                    { employeeId: trimmed },
                    { phone: trimmed },
                    ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
                ],
            },
            include: {
                branch: true,
                officeLocation: true,
            },
        });
        if (direct)
            return direct;
        if (!normalizedPhone)
            return null;
        const phoneUsers = await this.prisma.user.findMany({
            where: { role: enums_1.UserRole.OFFICE_BOY, phone: { not: null } },
            include: { branch: true, officeLocation: true },
        });
        return phoneUsers.find((u) => u.phone && (0, office_boy_util_1.normalizePhone)(u.phone) === normalizedPhone) ?? null;
    }
    async ensureOfficeBoyLocation(user) {
        if (user.officeLocationId && user.officeLocation?.isActive) {
            return user;
        }
        if (!user.branchId) {
            throw new common_1.BadRequestException('No branch assigned. Ask admin to edit your profile and set a branch.');
        }
        const location = await this.prisma.officeLocation.findFirst({
            where: { branchId: user.branchId, isActive: true },
            orderBy: { createdAt: 'asc' },
        });
        if (!location) {
            const branchName = user.branch?.name || 'your branch';
            throw new common_1.BadRequestException(`No office location configured for ${branchName}. Ask admin to create one under Office Locations and assign it to you.`);
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { officeLocationId: location.id },
        });
        return {
            ...user,
            officeLocationId: location.id,
            officeLocation: location,
        };
    }
    async officeBoyCheckIn(userId, dto) {
        if (dto.latitude == null || dto.longitude == null) {
            await this.logActivity(userId, enums_1.AttendanceActivityType.LOGIN_LOCATION_PERMISSION_DENIED, dto, 'GPS coordinates missing');
            throw new common_1.BadRequestException('Location permission is required to login. Please enable location permission and try again.');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                branch: true,
                officeLocation: true,
            },
        });
        if (!user || user.role !== enums_1.UserRole.OFFICE_BOY || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid user');
        }
        const officeBoyUser = await this.ensureOfficeBoyLocation(user);
        const loginPhotoUrl = await this.uploadAttendancePhoto(dto.photo, userId, 'check-in');
        const attendance = await this.recordCheckIn(officeBoyUser, dto, dto, loginPhotoUrl);
        await this.logActivity(userId, enums_1.AttendanceActivityType.LOGIN_SUCCESS, dto, 'Check-in successful', attendance.loginDistanceMeters ?? undefined);
        return (0, serialize_util_1.toJsonValue)({
            attendance: this.formatAttendance(attendance),
        });
    }
    async recordCheckIn(user, coords, logCoords, loginPhotoUrl) {
        if (!user.officeLocationId || !user.officeLocation?.isActive) {
            throw new common_1.BadRequestException('No office location assigned. Admin must edit this user, set Role to Office Boy, and select Branch + Office Location.');
        }
        if (!user.branchId) {
            throw new common_1.BadRequestException('No branch assigned. Contact admin.');
        }
        const location = user.officeLocation;
        const { allowed, distanceMeters } = (0, geo_util_1.isWithinRadius)(coords.latitude, coords.longitude, Number(location.latitude), Number(location.longitude), location.allowedRadiusMeters);
        if (!allowed) {
            await this.logActivity(user.id, enums_1.AttendanceActivityType.LOGIN_LOCATION_REJECTED, logCoords, `Distance: ${distanceMeters}m`, distanceMeters);
            const officeName = location.name || 'assigned office';
            throw new common_1.ForbiddenException(`You are ${(0, geo_util_1.formatDistanceMeters)(distanceMeters)} from ${officeName} (allowed: ${location.allowedRadiusMeters} m). ` +
                'Move closer to the office or ask admin to update the office location coordinates in Office Locations.');
        }
        const today = (0, geo_util_1.getStartOfDay)();
        const existing = await this.findTodayAttendance(user.id);
        if (existing?.isSessionActive) {
            await this.logActivity(user.id, enums_1.AttendanceActivityType.LOGIN_ALREADY_ACTIVE, logCoords, 'Already logged in today');
            throw new common_1.BadRequestException('You are already logged in.');
        }
        if (existing?.logoutTime && !(0, geo_util_1.canResumeAttendanceToday)(existing)) {
            throw new common_1.BadRequestException('Today\'s attendance is already completed.');
        }
        const now = new Date();
        const isLate = (0, geo_util_1.isLateCheckIn)(now);
        const lateReason = coords.lateReason?.trim();
        const resumingAfterEarlyLeave = Boolean(existing?.logoutTime);
        const mergedIsLate = (existing?.isLate ?? false) || isLate;
        const mergedLateReason = existing?.lateReason ?? (isLate ? lateReason : null);
        if (isLate && !existing?.lateReason && !lateReason) {
            throw new common_1.BadRequestException('You are late. Please provide a reason for late arrival before signing in.');
        }
        const accumulatedMinutes = resumingAfterEarlyLeave
            ? (existing?.workingDurationMinutes ?? 0)
            : 0;
        const checkInData = {
            loginTime: now,
            logoutTime: null,
            logoutLatitude: null,
            logoutLongitude: null,
            logoutDistanceMeters: null,
            loginLatitude: coords.latitude,
            loginLongitude: coords.longitude,
            loginDistanceMeters: distanceMeters,
            isSessionActive: true,
            status: enums_1.AttendanceStatus.INCOMPLETE,
            isLate: mergedIsLate,
            lateReason: mergedLateReason,
            isEarlyLeave: false,
            earlyLeaveReason: resumingAfterEarlyLeave ? existing?.earlyLeaveReason ?? null : null,
            workingDurationMinutes: resumingAfterEarlyLeave ? accumulatedMinutes : null,
            deviceInfo: coords.deviceInfo,
            branchId: user.branchId,
            locationId: user.officeLocationId,
            ...(loginPhotoUrl ? { loginPhotoUrl } : {}),
        };
        if (existing) {
            return this.prisma.officeBoyAttendance.update({
                where: { id: existing.id },
                data: checkInData,
                include: this.attendanceInclude(),
            });
        }
        try {
            return await this.prisma.officeBoyAttendance.create({
                data: {
                    userId: user.id,
                    attendanceDate: today,
                    ...checkInData,
                },
                include: this.attendanceInclude(),
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                const fallback = await this.findTodayAttendance(user.id);
                if (!fallback)
                    throw error;
                if (fallback.isSessionActive) {
                    throw new common_1.BadRequestException('You are already logged in.');
                }
                if (fallback.logoutTime && !(0, geo_util_1.canResumeAttendanceToday)(fallback)) {
                    throw new common_1.BadRequestException('Today\'s attendance is already completed.');
                }
                return this.prisma.officeBoyAttendance.update({
                    where: { id: fallback.id },
                    data: checkInData,
                    include: this.attendanceInclude(),
                });
            }
            throw error;
        }
    }
    async officeBoyLogout(userId, dto) {
        if (dto.latitude == null || dto.longitude == null) {
            await this.logActivity(userId, enums_1.AttendanceActivityType.LOGOUT_LOCATION_PERMISSION_DENIED, dto, 'GPS missing');
            throw new common_1.BadRequestException('Location permission is required to logout. Please enable location permission and try again.');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { officeLocation: true },
        });
        if (!user || user.role !== enums_1.UserRole.OFFICE_BOY || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid user');
        }
        if (!user.officeLocation) {
            throw new common_1.BadRequestException('No office location assigned.');
        }
        const location = user.officeLocation;
        const { allowed, distanceMeters } = (0, geo_util_1.isWithinRadius)(dto.latitude, dto.longitude, Number(location.latitude), Number(location.longitude), location.allowedRadiusMeters);
        if (!allowed) {
            await this.logActivity(userId, enums_1.AttendanceActivityType.LOGOUT_LOCATION_REJECTED, dto, `Distance: ${distanceMeters}m`, distanceMeters);
            throw new common_1.ForbiddenException(`You are ${(0, geo_util_1.formatDistanceMeters)(distanceMeters)} from ${location.name} (allowed: ${location.allowedRadiusMeters} m). ` +
                'Move closer to the office or ask admin to update the office location coordinates.');
        }
        const attendance = await this.findTodayAttendance(userId);
        if (!attendance || !attendance.loginTime) {
            await this.logActivity(userId, enums_1.AttendanceActivityType.LOGOUT_WITHOUT_LOGIN, dto, 'No active login');
            throw new common_1.BadRequestException('No active login session found for today.');
        }
        if (!attendance.isSessionActive || attendance.logoutTime) {
            await this.logActivity(userId, enums_1.AttendanceActivityType.LOGOUT_ALREADY_COMPLETED, dto, 'Already logged out');
            throw new common_1.BadRequestException('You have already logged out for today.');
        }
        const now = new Date();
        const accumulatedMinutes = attendance.workingDurationMinutes ?? 0;
        const sessionMinutes = (0, geo_util_1.calculateWorkingDurationMinutes)(attendance.loginTime, now);
        const workingDurationMinutes = accumulatedMinutes + sessionMinutes;
        const dayStatus = (0, geo_util_1.resolveAttendanceStatusFromDuration)(workingDurationMinutes);
        const isEarlyLeave = (0, geo_util_1.isEarlyLeaveLogout)(attendance.loginTime, now, accumulatedMinutes);
        const earlyLeaveReason = dto.earlyLeaveReason?.trim();
        if (isEarlyLeave && !earlyLeaveReason) {
            throw new common_1.BadRequestException('You are leaving before completing 9 working hours. Please provide a reason before signing out.');
        }
        const logoutPhotoUrl = await this.uploadAttendancePhoto(dto.photo, userId, 'check-out');
        const updated = await this.prisma.officeBoyAttendance.update({
            where: { id: attendance.id },
            data: {
                logoutTime: now,
                logoutLatitude: dto.latitude,
                logoutLongitude: dto.longitude,
                logoutDistanceMeters: distanceMeters,
                workingDurationMinutes,
                isSessionActive: false,
                status: dayStatus,
                isEarlyLeave,
                earlyLeaveReason: isEarlyLeave ? earlyLeaveReason : null,
                deviceInfo: dto.deviceInfo ?? attendance.deviceInfo,
                ...(logoutPhotoUrl ? { logoutPhotoUrl } : {}),
            },
            include: this.attendanceInclude(),
        });
        await this.logActivity(userId, enums_1.AttendanceActivityType.LOGOUT_SUCCESS, dto, 'Logout successful', distanceMeters);
        return (0, serialize_util_1.toJsonValue)({
            message: 'Logout successful',
            attendance: this.formatAttendance(updated),
        });
    }
    async getMyDashboard(userId) {
        await this.prisma.officeBoyAttendance.updateMany({
            where: {
                userId,
                isSessionActive: true,
                attendanceDate: { lt: (0, geo_util_1.getStartOfDay)() },
                logoutTime: null,
            },
            data: {
                isSessionActive: false,
                status: enums_1.AttendanceStatus.INCOMPLETE,
            },
        });
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                employeeId: true,
                branch: { select: { id: true, name: true } },
                officeLocation: { select: { id: true, name: true, allowedRadiusMeters: true } },
            },
        });
        const todayAttendance = await this.findTodayAttendance(userId);
        const history = await this.prisma.officeBoyAttendance.findMany({
            where: { userId },
            include: this.attendanceInclude(),
            orderBy: { attendanceDate: 'desc' },
            take: 30,
        });
        return (0, serialize_util_1.toJsonValue)({
            user,
            todayAttendance: todayAttendance ? this.formatAttendance(todayAttendance) : null,
            history: history.map((a) => this.formatAttendance(a)),
            isLoggedIn: todayAttendance?.isSessionActive ?? false,
        });
    }
    async getMyHistory(userId, filters) {
        const where = this.buildFilterWhere(filters, userId);
        const records = await this.prisma.officeBoyAttendance.findMany({
            where,
            include: this.attendanceInclude(),
            orderBy: { attendanceDate: 'desc' },
        });
        return records.map((a) => this.formatAttendance(a));
    }
    async getAllAttendance(filters) {
        const where = this.buildFilterWhere(filters);
        const records = await this.prisma.officeBoyAttendance.findMany({
            where,
            include: {
                ...this.attendanceInclude(),
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        employeeId: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            orderBy: [{ attendanceDate: 'desc' }, { loginTime: 'desc' }],
        });
        return records.map((a) => ({
            ...this.formatAttendance(a),
            staffName: `${a.user.firstName} ${a.user.lastName}`,
            staffEmployeeId: a.user.employeeId,
            staffEmail: a.user.email,
            staffPhone: a.user.phone,
        }));
    }
    async getActivityLogs(userId) {
        return this.prisma.attendanceActivityLog.findMany({
            where: userId ? { userId } : {},
            include: {
                user: { select: { firstName: true, lastName: true, employeeId: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
    }
    buildFilterWhere(filters, userId) {
        const where = {};
        if (userId)
            where.userId = userId;
        if (filters.branchId)
            where.branchId = filters.branchId;
        if (filters.locationId)
            where.locationId = filters.locationId;
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.status === 'FULL_DAY') {
            where.status = { in: ['FULL_DAY', 'PRESENT'] };
        }
        else if (filters.status) {
            where.status = filters.status;
        }
        const dateFilter = this.resolveDateFilter(filters);
        if (dateFilter) {
            where.attendanceDate = dateFilter;
        }
        return where;
    }
    resolveDateFilter(filters) {
        if (filters.period === 'today' || filters.period === 'yesterday' || filters.period === 'week' || filters.period === 'month') {
            const { gte, lt } = (0, geo_util_1.getAttendancePeriodRange)(filters.period);
            return { gte, lt };
        }
        if (filters.startDate && filters.endDate) {
            return (0, geo_util_1.getCustomDateRange)(filters.startDate, filters.endDate);
        }
        return undefined;
    }
    async findTodayAttendance(userId) {
        const today = (0, geo_util_1.getStartOfDay)();
        const tomorrow = (0, geo_util_1.getEndOfDay)();
        const byUnique = await this.prisma.officeBoyAttendance.findUnique({
            where: { userId_attendanceDate: { userId, attendanceDate: today } },
            include: this.attendanceInclude(),
        });
        if (byUnique)
            return byUnique;
        return this.prisma.officeBoyAttendance.findFirst({
            where: {
                userId,
                attendanceDate: { gte: today, lt: tomorrow },
            },
            include: this.attendanceInclude(),
            orderBy: { createdAt: 'desc' },
        });
    }
    attendanceInclude() {
        return {
            branch: { select: { id: true, name: true } },
            location: { select: { id: true, name: true } },
            correctionRequests: {
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        };
    }
    formatAttendance(attendance) {
        const isLate = attendance.isLate ?? false;
        const totalWorkingMinutes = (0, geo_util_1.getTotalWorkingMinutes)(attendance);
        const isDayComplete = (0, geo_util_1.isAttendanceDayComplete)(attendance);
        const canSignInAgain = (0, geo_util_1.canResumeAttendanceToday)(attendance);
        const latestCorrection = attendance.correctionRequests?.[0];
        const approvedCorrectionType = attendance.approvedCorrectionType ?? null;
        let statusLabel = (0, geo_util_1.formatAttendanceStatusLabel)(attendance.status, isLate);
        if (approvedCorrectionType) {
            statusLabel = (0, attendance_correction_util_1.getAttendanceCorrectionTypeLabel)(approvedCorrectionType);
        }
        else if (latestCorrection?.status === enums_1.AttendanceCorrectionStatus.PENDING) {
            statusLabel = 'Pending Approval';
        }
        return {
            id: attendance.id,
            attendanceDate: attendance.attendanceDate,
            loginTime: attendance.loginTime,
            logoutTime: attendance.logoutTime,
            loginLatitude: attendance.loginLatitude != null ? Number(attendance.loginLatitude) : null,
            loginLongitude: attendance.loginLongitude != null ? Number(attendance.loginLongitude) : null,
            logoutLatitude: attendance.logoutLatitude != null ? Number(attendance.logoutLatitude) : null,
            logoutLongitude: attendance.logoutLongitude != null ? Number(attendance.logoutLongitude) : null,
            loginDistanceMeters: attendance.loginDistanceMeters,
            logoutDistanceMeters: attendance.logoutDistanceMeters,
            workingDurationMinutes: attendance.workingDurationMinutes,
            totalWorkingMinutes,
            status: attendance.status,
            statusLabel,
            approvedCorrectionType,
            correctionRequest: latestCorrection
                ? {
                    id: latestCorrection.id,
                    requestType: latestCorrection.requestType,
                    requestTypeLabel: (0, attendance_correction_util_1.getAttendanceCorrectionTypeLabel)(latestCorrection.requestType),
                    comments: latestCorrection.comments,
                    status: latestCorrection.status,
                    adminNotes: latestCorrection.adminNotes ?? null,
                    createdAt: latestCorrection.createdAt,
                }
                : null,
            isLate,
            lateReason: attendance.lateReason ?? null,
            isEarlyLeave: attendance.isEarlyLeave ?? false,
            earlyLeaveReason: attendance.earlyLeaveReason ?? null,
            isSessionActive: attendance.isSessionActive,
            loginPhotoUrl: attendance.loginPhotoUrl ?? null,
            logoutPhotoUrl: attendance.logoutPhotoUrl ?? null,
            isDayComplete,
            canSignInAgain,
            branch: attendance.branch,
            location: attendance.location,
            workingDurationFormatted: totalWorkingMinutes > 0 || attendance.isSessionActive
                ? (0, geo_util_1.formatDuration)(totalWorkingMinutes)
                : null,
        };
    }
    async uploadAttendancePhoto(photo, userId, type) {
        if (!photo?.trim()) {
            return null;
        }
        const today = (0, geo_util_1.getStartOfDay)().toISOString().slice(0, 10);
        return this.cloudinary.uploadBase64Image(photo, `support-app/attendance/${userId}`, `${today}-${type}`);
    }
    async logActivity(userId, action, coords, message, distanceMeters) {
        if (!userId)
            return;
        await this.prisma.attendanceActivityLog.create({
            data: {
                userId,
                action,
                latitude: coords.latitude,
                longitude: coords.longitude,
                distanceMeters,
                message,
            },
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService,
        cloudinary_service_1.CloudinaryService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map