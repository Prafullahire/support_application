"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ACCESS_ROLES = void 0;
exports.isSuperAdmin = isSuperAdmin;
exports.isPrivilegedAdmin = isPrivilegedAdmin;
const enums_1 = require("../enums");
exports.ADMIN_ACCESS_ROLES = [enums_1.UserRole.ADMIN, enums_1.UserRole.SUPER_ADMIN];
function isSuperAdmin(role) {
    return role === enums_1.UserRole.SUPER_ADMIN;
}
function isPrivilegedAdmin(role) {
    return role === enums_1.UserRole.ADMIN || role === enums_1.UserRole.SUPER_ADMIN;
}
//# sourceMappingURL=roles.constants.js.map