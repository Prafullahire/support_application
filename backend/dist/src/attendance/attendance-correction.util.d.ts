import { AttendanceCorrectionType, AttendanceStatus } from '../common/enums';
export declare const ATTENDANCE_CORRECTION_TYPE_LABELS: Record<AttendanceCorrectionType, string>;
export declare function getAttendanceCorrectionTypeLabel(type: AttendanceCorrectionType | string): string;
export declare function mapCorrectionTypeToAttendanceStatus(type: AttendanceCorrectionType | string): AttendanceStatus;
