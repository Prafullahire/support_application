"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ATTENDANCE_CORRECTION_TYPE_LABELS = void 0;
exports.getAttendanceCorrectionTypeLabel = getAttendanceCorrectionTypeLabel;
exports.mapCorrectionTypeToAttendanceStatus = mapCorrectionTypeToAttendanceStatus;
const enums_1 = require("../common/enums");
exports.ATTENDANCE_CORRECTION_TYPE_LABELS = {
    PRESENT_FULL_DAY: 'Present (Full Day)',
    PRESENT_FULL_DAY_NOT_COMPLETED_9H: 'Present (Full Day - Not Completed 9 hrs)',
    PRESENT_HALF_DAY: 'Present (Half Day)',
    ABSENT_INFORMED_SENIOR: 'Absent (Informed Senior)',
    HOLIDAY: 'Holiday',
};
function getAttendanceCorrectionTypeLabel(type) {
    return exports.ATTENDANCE_CORRECTION_TYPE_LABELS[type] ?? (type ? String(type).replace(/_/g, ' ') : '—');
}
function mapCorrectionTypeToAttendanceStatus(type) {
    switch (type) {
        case enums_1.AttendanceCorrectionType.PRESENT_FULL_DAY:
            return enums_1.AttendanceStatus.FULL_DAY;
        case enums_1.AttendanceCorrectionType.PRESENT_FULL_DAY_NOT_COMPLETED_9H:
            return enums_1.AttendanceStatus.EARLY_LEAVE;
        case enums_1.AttendanceCorrectionType.PRESENT_HALF_DAY:
            return enums_1.AttendanceStatus.HALF_DAY;
        case enums_1.AttendanceCorrectionType.ABSENT_INFORMED_SENIOR:
            return enums_1.AttendanceStatus.ABSENT;
        case enums_1.AttendanceCorrectionType.HOLIDAY:
            return enums_1.AttendanceStatus.HOLIDAY;
        default:
            return enums_1.AttendanceStatus.INCOMPLETE;
    }
}
//# sourceMappingURL=attendance-correction.util.js.map