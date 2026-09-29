export declare function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number;
export declare function isWithinRadius(currentLat: number, currentLon: number, officeLat: number, officeLon: number, allowedRadiusMeters: number): {
    allowed: boolean;
    distanceMeters: number;
};
export declare function formatDistanceMeters(meters: number): string;
export declare function getStartOfDay(date?: Date): Date;
export declare function getEndOfDay(date?: Date): Date;
export declare function addCalendarDays(date: Date, days: number): Date;
export declare function getAttendancePeriodRange(period: 'today' | 'yesterday' | 'week' | 'month'): {
    gte: Date;
    lt: Date;
};
export declare function parseDateInput(value: string): Date | null;
export declare function getCustomDateRange(startDate?: string, endDate?: string): {
    gte?: Date;
    lt?: Date;
} | undefined;
export declare function calculateWorkingDurationMinutes(loginTime: Date, logoutTime: Date): number;
export declare const FULL_DAY_MINUTES: number;
export declare const EARLY_LEAVE_MIN_MINUTES: number;
export declare const HALF_DAY_MIN_MINUTES: number;
export declare const SHIFT_START_HOUR = 9;
export declare const SHIFT_START_MINUTE = 0;
export declare const LATE_GRACE_MINUTES = 0;
export type AttendanceDayStatus = 'FULL_DAY' | 'EARLY_LEAVE' | 'HALF_DAY' | 'INCOMPLETE';
export declare function resolveAttendanceStatusFromDuration(minutes: number): AttendanceDayStatus;
export declare function isLateCheckIn(loginTime: Date): boolean;
export declare function getTotalWorkingMinutes(attendance: {
    loginTime: Date | null;
    workingDurationMinutes: number | null;
    isSessionActive: boolean;
}, now?: Date): number;
export declare function isAttendanceDayComplete(attendance: {
    logoutTime: Date | null;
    workingDurationMinutes: number | null;
    isSessionActive: boolean;
}): boolean;
export declare function canResumeAttendanceToday(attendance: {
    logoutTime: Date | null;
    workingDurationMinutes: number | null;
    isSessionActive: boolean;
}): boolean;
export declare function isEarlyLeaveLogout(loginTime: Date, logoutTime: Date, accumulatedMinutes?: number): boolean;
export declare function formatAttendanceStatusLabel(status: string, isLate?: boolean): string;
export declare function getAttendanceStatusLabel(status: string): string;
export declare function formatDuration(minutes: number): string;
