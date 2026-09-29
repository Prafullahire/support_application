"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoles = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
const roles_constants_1 = require("../constants/roles.constants");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
const AdminRoles = () => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles_constants_1.ADMIN_ACCESS_ROLES);
exports.AdminRoles = AdminRoles;
//# sourceMappingURL=roles.decorator.js.map