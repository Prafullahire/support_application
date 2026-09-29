import { UserRole } from '../enums';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const AdminRoles: () => import("@nestjs/common").CustomDecorator<string>;
