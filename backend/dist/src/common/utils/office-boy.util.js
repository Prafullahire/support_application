"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhone = normalizePhone;
exports.generateOfficeBoyEmail = generateOfficeBoyEmail;
exports.generateEmployeeId = generateEmployeeId;
function normalizePhone(phone) {
    return phone.replace(/\D/g, '');
}
function generateOfficeBoyEmail(phone) {
    const digits = normalizePhone(phone);
    return `ob.${digits || Date.now()}@staff.local`;
}
function generateEmployeeId(phone) {
    const digits = normalizePhone(phone);
    const suffix = digits.slice(-10) || String(Date.now()).slice(-10);
    return `OB-${suffix}`;
}
//# sourceMappingURL=office-boy.util.js.map