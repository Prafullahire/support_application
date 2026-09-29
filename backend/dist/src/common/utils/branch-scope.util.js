"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBranchFilter = resolveBranchFilter;
exports.resolveBranchId = resolveBranchId;
exports.assertBranchAccess = assertBranchAccess;
exports.enforceActorBranchId = enforceActorBranchId;
exports.canAssignRole = canAssignRole;
exports.adminListFilter = adminListFilter;
exports.usesAdminDataScope = usesAdminDataScope;
const common_1 = require("@nestjs/common");
const enums_1 = require("../enums");
const roles_constants_1 = require("../constants/roles.constants");
function resolveBranchFilter(user, requestedBranchId) {
    if ((0, roles_constants_1.isSuperAdmin)(user.role)) {
        return requestedBranchId ? { branchId: requestedBranchId } : {};
    }
    if (user.role === enums_1.UserRole.ADMIN) {
        if (!user.branchId) {
            return { branchId: '__no_branch__' };
        }
        return { branchId: user.branchId };
    }
    return {};
}
function resolveBranchId(user, requestedBranchId) {
    return resolveBranchFilter(user, requestedBranchId).branchId;
}
function assertBranchAccess(user, recordBranchId) {
    if ((0, roles_constants_1.isSuperAdmin)(user.role))
        return;
    if (user.role === enums_1.UserRole.ADMIN && user.branchId && recordBranchId === user.branchId)
        return;
    throw new common_1.ForbiddenException('You do not have access to this branch data');
}
function enforceActorBranchId(user, requestedBranchId) {
    if ((0, roles_constants_1.isSuperAdmin)(user.role)) {
        return requestedBranchId;
    }
    if (user.role === enums_1.UserRole.ADMIN) {
        if (!user.branchId) {
            throw new common_1.ForbiddenException('Your admin account is not assigned to a branch');
        }
        return user.branchId;
    }
    return requestedBranchId;
}
function canAssignRole(actor, targetRole) {
    if ((0, roles_constants_1.isSuperAdmin)(actor.role))
        return true;
    if (actor.role === enums_1.UserRole.ADMIN) {
        return targetRole === enums_1.UserRole.ADMIN || targetRole === enums_1.UserRole.OFFICE_BOY;
    }
    return false;
}
function adminListFilter(user) {
    return resolveBranchFilter(user);
}
function usesAdminDataScope(role) {
    return (0, roles_constants_1.isPrivilegedAdmin)(role);
}
//# sourceMappingURL=branch-scope.util.js.map