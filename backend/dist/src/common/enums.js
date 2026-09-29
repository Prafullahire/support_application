"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceActivityType = exports.AttendanceCorrectionStatus = exports.AttendanceCorrectionType = exports.AttendanceStatus = exports.NotificationType = exports.PgStatus = exports.AmcStatus = exports.CourierStatus = exports.AssetStatus = exports.RequestStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["OFFICE_BOY"] = "OFFICE_BOY";
})(UserRole || (exports.UserRole = UserRole = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["DRAFT"] = "DRAFT";
    RequestStatus["SUBMITTED"] = "SUBMITTED";
    RequestStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    RequestStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RequestStatus["COMPLETED"] = "COMPLETED";
    RequestStatus["REJECTED"] = "REJECTED";
    RequestStatus["CANCELLED"] = "CANCELLED";
    RequestStatus["ON_HOLD"] = "ON_HOLD";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var AssetStatus;
(function (AssetStatus) {
    AssetStatus["AVAILABLE"] = "AVAILABLE";
    AssetStatus["ASSIGNED"] = "ASSIGNED";
    AssetStatus["RETURNED"] = "RETURNED";
    AssetStatus["DAMAGED"] = "DAMAGED";
    AssetStatus["UNDER_REPAIR"] = "UNDER_REPAIR";
    AssetStatus["LOST"] = "LOST";
})(AssetStatus || (exports.AssetStatus = AssetStatus = {}));
var CourierStatus;
(function (CourierStatus) {
    CourierStatus["SUBMITTED"] = "SUBMITTED";
    CourierStatus["BOOKED"] = "BOOKED";
    CourierStatus["PICKED_UP"] = "PICKED_UP";
    CourierStatus["IN_TRANSIT"] = "IN_TRANSIT";
    CourierStatus["DELIVERED"] = "DELIVERED";
    CourierStatus["COMPLETED"] = "COMPLETED";
})(CourierStatus || (exports.CourierStatus = CourierStatus = {}));
var AmcStatus;
(function (AmcStatus) {
    AmcStatus["ACTIVE"] = "ACTIVE";
    AmcStatus["EXPIRED"] = "EXPIRED";
    AmcStatus["RENEWED"] = "RENEWED";
    AmcStatus["CLOSED"] = "CLOSED";
})(AmcStatus || (exports.AmcStatus = AmcStatus = {}));
var PgStatus;
(function (PgStatus) {
    PgStatus["ACTIVE"] = "ACTIVE";
    PgStatus["EXPIRED"] = "EXPIRED";
    PgStatus["RENEWED"] = "RENEWED";
    PgStatus["CLOSED"] = "CLOSED";
})(PgStatus || (exports.PgStatus = PgStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["REQUEST_CREATED"] = "REQUEST_CREATED";
    NotificationType["REQUEST_UPDATED"] = "REQUEST_UPDATED";
    NotificationType["REQUEST_COMPLETED"] = "REQUEST_COMPLETED";
    NotificationType["ASSET_ASSIGNED"] = "ASSET_ASSIGNED";
    NotificationType["COURIER_DELIVERY"] = "COURIER_DELIVERY";
    NotificationType["LOW_STOCK"] = "LOW_STOCK";
    NotificationType["CONTRACT_EXPIRY"] = "CONTRACT_EXPIRY";
    NotificationType["ACCOMMODATION_EXPIRY"] = "ACCOMMODATION_EXPIRY";
    NotificationType["ATTENDANCE_CORRECTION_REQUEST"] = "ATTENDANCE_CORRECTION_REQUEST";
    NotificationType["ATTENDANCE_CORRECTION_APPROVED"] = "ATTENDANCE_CORRECTION_APPROVED";
    NotificationType["ATTENDANCE_CORRECTION_REJECTED"] = "ATTENDANCE_CORRECTION_REJECTED";
    NotificationType["GENERAL"] = "GENERAL";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["FULL_DAY"] = "FULL_DAY";
    AttendanceStatus["HALF_DAY"] = "HALF_DAY";
    AttendanceStatus["EARLY_LEAVE"] = "EARLY_LEAVE";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["PARTIAL"] = "PARTIAL";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["INCOMPLETE"] = "INCOMPLETE";
    AttendanceStatus["REJECTED_LOCATION"] = "REJECTED_LOCATION";
    AttendanceStatus["HOLIDAY"] = "HOLIDAY";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var AttendanceCorrectionType;
(function (AttendanceCorrectionType) {
    AttendanceCorrectionType["PRESENT_FULL_DAY"] = "PRESENT_FULL_DAY";
    AttendanceCorrectionType["PRESENT_FULL_DAY_NOT_COMPLETED_9H"] = "PRESENT_FULL_DAY_NOT_COMPLETED_9H";
    AttendanceCorrectionType["PRESENT_HALF_DAY"] = "PRESENT_HALF_DAY";
    AttendanceCorrectionType["ABSENT_INFORMED_SENIOR"] = "ABSENT_INFORMED_SENIOR";
    AttendanceCorrectionType["HOLIDAY"] = "HOLIDAY";
})(AttendanceCorrectionType || (exports.AttendanceCorrectionType = AttendanceCorrectionType = {}));
var AttendanceCorrectionStatus;
(function (AttendanceCorrectionStatus) {
    AttendanceCorrectionStatus["PENDING"] = "PENDING";
    AttendanceCorrectionStatus["APPROVED"] = "APPROVED";
    AttendanceCorrectionStatus["REJECTED"] = "REJECTED";
})(AttendanceCorrectionStatus || (exports.AttendanceCorrectionStatus = AttendanceCorrectionStatus = {}));
var AttendanceActivityType;
(function (AttendanceActivityType) {
    AttendanceActivityType["LOGIN_SUCCESS"] = "LOGIN_SUCCESS";
    AttendanceActivityType["LOGOUT_SUCCESS"] = "LOGOUT_SUCCESS";
    AttendanceActivityType["LOGIN_LOCATION_REJECTED"] = "LOGIN_LOCATION_REJECTED";
    AttendanceActivityType["LOGOUT_LOCATION_REJECTED"] = "LOGOUT_LOCATION_REJECTED";
    AttendanceActivityType["LOGIN_LOCATION_PERMISSION_DENIED"] = "LOGIN_LOCATION_PERMISSION_DENIED";
    AttendanceActivityType["LOGOUT_LOCATION_PERMISSION_DENIED"] = "LOGOUT_LOCATION_PERMISSION_DENIED";
    AttendanceActivityType["LOGIN_ALREADY_ACTIVE"] = "LOGIN_ALREADY_ACTIVE";
    AttendanceActivityType["LOGOUT_WITHOUT_LOGIN"] = "LOGOUT_WITHOUT_LOGIN";
    AttendanceActivityType["LOGOUT_ALREADY_COMPLETED"] = "LOGOUT_ALREADY_COMPLETED";
})(AttendanceActivityType || (exports.AttendanceActivityType = AttendanceActivityType = {}));
//# sourceMappingURL=enums.js.map