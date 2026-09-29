import { AttendanceCorrectionType } from '../../common/enums';
export declare class CreateAttendanceCorrectionDto {
    attendanceId: string;
    requestType: AttendanceCorrectionType;
    comments: string;
}
export declare class ReviewAttendanceCorrectionDto {
    adminNotes?: string;
}
