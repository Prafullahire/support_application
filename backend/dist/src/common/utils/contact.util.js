"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEmailOrPhone = parseEmailOrPhone;
exports.isEmailValue = isEmailValue;
exports.isSystemGeneratedEmail = isSystemGeneratedEmail;
const common_1 = require("@nestjs/common");
const office_boy_util_1 = require("./office-boy.util");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function parseEmailOrPhone(value) {
    const trimmed = value.trim();
    if (!trimmed) {
        throw new common_1.BadRequestException('Email or phone number is required');
    }
    if (EMAIL_PATTERN.test(trimmed)) {
        return { email: trimmed.toLowerCase() };
    }
    const digits = (0, office_boy_util_1.normalizePhone)(trimmed);
    if (digits.length >= 10) {
        return {
            email: `user.${digits}@register.local`,
            phone: digits,
        };
    }
    throw new common_1.BadRequestException('Please enter a valid email or phone number');
}
function isEmailValue(value) {
    return EMAIL_PATTERN.test(value.trim());
}
function isSystemGeneratedEmail(email) {
    if (!email)
        return true;
    const normalized = email.trim().toLowerCase();
    return normalized.endsWith('@staff.local') || normalized.endsWith('@register.local');
}
//# sourceMappingURL=contact.util.js.map