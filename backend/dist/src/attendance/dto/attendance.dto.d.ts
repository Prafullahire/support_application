export declare class OfficeBoyLoginDto {
    loginId: string;
    password: string;
    latitude: number;
    longitude: number;
    deviceInfo?: string;
}
export declare class OfficeBoyLogoutDto {
    latitude: number;
    longitude: number;
    deviceInfo?: string;
    earlyLeaveReason?: string;
    photo?: string;
}
export declare class OfficeBoyCheckInDto {
    latitude: number;
    longitude: number;
    deviceInfo?: string;
    lateReason?: string;
    photo?: string;
}
export declare class AttendanceFilterDto {
    branchId?: string;
    locationId?: string;
    userId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    period?: 'today' | 'yesterday' | 'week' | 'month';
}
