import { UserRole } from '../enums';
export interface ScopedUser {
    id: string;
    role: UserRole;
    branchId?: string | null;
}
export declare function resolveBranchFilter(user: ScopedUser, requestedBranchId?: string): {
    branchId?: string;
};
export declare function resolveBranchId(user: ScopedUser, requestedBranchId?: string): string | undefined;
export declare function assertBranchAccess(user: ScopedUser, recordBranchId?: string | null): void;
export declare function enforceActorBranchId(user: ScopedUser, requestedBranchId?: string): string | undefined;
export declare function canAssignRole(actor: ScopedUser, targetRole: UserRole): boolean;
export declare function adminListFilter(user: ScopedUser): {
    branchId?: string;
};
export declare function usesAdminDataScope(role: UserRole): boolean;
