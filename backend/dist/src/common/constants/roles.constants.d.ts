import { UserRole } from '../enums';
export declare const ADMIN_ACCESS_ROLES: UserRole[];
export declare function isSuperAdmin(role: UserRole): boolean;
export declare function isPrivilegedAdmin(role: UserRole): boolean;
