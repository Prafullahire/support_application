"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LATE_GRACE_MINUTES = exports.SHIFT_START_MINUTE = exports.SHIFT_START_HOUR = exports.HALF_DAY_MIN_MINUTES = exports.EARLY_LEAVE_MIN_MINUTES = exports.FULL_DAY_MINUTES = void 0;
exports.getDistanceInMeters = getDistanceInMeters;
exports.isWithinRadius = isWithinRadius;
exports.formatDistanceMeters = formatDistanceMeters;
exports.getStartOfDay = getStartOfDay;
exports.getEndOfDay = getEndOfDay;
exports.addCalendarDays = addCalendarDays;
exports.getAttendancePeriodRange = getAttendancePeriodRange;
exports.parseDateInput = parseDateInput;
exports.getCustomDateRange = getCustomDateRange;
exports.calculateWorkingDurationMinutes = calculateWorkingDurationMinutes;
exports.resolveAttendanceStatusFromDuration = resolveAttendanceStatusFromDuration;
exports.isLateCheckIn = isLateCheckIn;
exports.getTotalWorkingMinutes = getTotalWorkingMinutes;
exports.isAttendanceDayComplete = isAttendanceDayComplete;
exports.canResumeAttendanceToday = canResumeAttendanceToday;
exports.isEarlyLeaveLogout = isEarlyLeaveLogout;
exports.formatAttendanceStatusLabel = formatAttendanceStatusLabel;
exports.getAttendanceStatusLabel = getAttendanceStatusLabel;
exports.formatDuration = formatDuration;
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const earthRadiusMeters = 6371000;
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMeters * c;
}
function isWithinRadius(currentLat, currentLon, officeLat, officeLon, allowedRadiusMeters) {
    const distanceMeters = getDistanceInMeters(currentLat, currentLon, officeLat, officeLon);
    return {
        allowed: distanceMeters <= allowedRadiusMeters,
        distanceMeters: Math.round(distanceMeters * 100) / 100,
    };
}
function formatDistanceMeters(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
}
function getStartOfDay(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(Date.UTC(year, month, day));
}
function getEndOfDay(date = new Date()) {
    const start = getStartOfDay(date);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return end;
}
function addCalendarDays(date, days) {
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
}
function getAttendancePeriodRange(period) {
    const todayStart = getStartOfDay();
    const tomorrowStart = getEndOfDay();
    if (period === 'today') {
        return { gte: todayStart, lt: tomorrowStart };
    }
    if (period === 'yesterday') {
        const yesterdayStart = addCalendarDays(todayStart, -1);
        return { gte: yesterdayStart, lt: todayStart };
    }
    if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { gte: getStartOfDay(weekAgo), lt: tomorrowStart };
    }
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return { gte: getStartOfDay(monthAgo), lt: tomorrowStart };
}
function parseDateInput(value) {
    if (!value)
        return null;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day)
        return null;
    return new Date(year, month - 1, day);
}
function getCustomDateRange(startDate, endDate) {
    if (!startDate && !endDate)
        return undefined;
    let start = startDate ? parseDateInput(startDate) : null;
    let end = endDate ? parseDateInput(endDate) : null;
    if (start && end && start > end) {
        const swappedStart = end;
        end = start;
        start = swappedStart;
    }
    const range = {};
    if (start)
        range.gte = getStartOfDay(start);
    if (end)
        range.lt = getEndOfDay(end);
    return Object.keys(range).length ? range : undefined;
}
function calculateWorkingDurationMinutes(loginTime, logoutTime) {
    const diffMs = logoutTime.getTime() - loginTime.getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
}
exports.FULL_DAY_MINUTES = 9 * 60;
exports.EARLY_LEAVE_MIN_MINUTES = 7 * 60;
exports.HALF_DAY_MIN_MINUTES = 4.5 * 60;
exports.SHIFT_START_HOUR = 9;
exports.SHIFT_START_MINUTE = 0;
exports.LATE_GRACE_MINUTES = 0;
function resolveAttendanceStatusFromDuration(minutes) {
    if (minutes >= exports.FULL_DAY_MINUTES)
        return 'FULL_DAY';
    if (minutes >= exports.EARLY_LEAVE_MIN_MINUTES)
        return 'EARLY_LEAVE';
    if (minutes >= exports.HALF_DAY_MIN_MINUTES)
        return 'HALF_DAY';
    return 'INCOMPLETE';
}
function isLateCheckIn(loginTime) {
    const shiftStart = new Date(loginTime);
    shiftStart.setHours(exports.SHIFT_START_HOUR, exports.SHIFT_START_MINUTE + exports.LATE_GRACE_MINUTES, 0, 0);
    return loginTime.getTime() > shiftStart.getTime();
}
function getTotalWorkingMinutes(attendance, now = new Date()) {
    const accumulated = attendance.workingDurationMinutes ?? 0;
    if (attendance.isSessionActive && attendance.loginTime) {
        return accumulated + calculateWorkingDurationMinutes(attendance.loginTime, now);
    }
    return accumulated;
}
function isAttendanceDayComplete(attendance) {
    return Boolean(!attendance.isSessionActive &&
        attendance.logoutTime &&
        (attendance.workingDurationMinutes ?? 0) >= exports.FULL_DAY_MINUTES);
}
function canResumeAttendanceToday(attendance) {
    return Boolean(!attendance.isSessionActive &&
        attendance.logoutTime &&
        (attendance.workingDurationMinutes ?? 0) < exports.FULL_DAY_MINUTES);
}
function isEarlyLeaveLogout(loginTime, logoutTime, accumulatedMinutes = 0) {
    return (accumulatedMinutes + calculateWorkingDurationMinutes(loginTime, logoutTime) <
        exports.FULL_DAY_MINUTES);
}
function formatAttendanceStatusLabel(status, isLate = false) {
    const base = getAttendanceStatusLabel(status);
    if (!isLate)
        return base;
    if (status === 'INCOMPLETE')
        return 'Late';
    return `${base} · Late`;
}
function getAttendanceStatusLabel(status) {
    const labels = {
        FULL_DAY: 'Full Day',
        HALF_DAY: 'Half Day',
        EARLY_LEAVE: 'Early Leave',
        PRESENT: 'Full Day',
        INCOMPLETE: 'Incomplete',
        ABSENT: 'Absent',
        LATE: 'Late',
        PARTIAL: 'Partial',
        REJECTED_LOCATION: 'Rejected Location',
        HOLIDAY: 'Holiday',
    };
    return labels[status] || status.replace(/_/g, ' ');
}
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}
//# sourceMappingURL=geo.util.js.map