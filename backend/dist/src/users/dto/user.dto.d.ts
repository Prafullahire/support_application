import { UserRole } from '../../common/enums';
export declare class CreateUserDto {
    email?: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
    branchId?: string;
    departmentId?: string;
    employeeId?: string;
    officeLocationId?: string;
    joiningDate?: string;
    leavingDate?: string;
    address?: string;
}
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: UserRole;
    branchId?: string;
    departmentId?: string;
    employeeId?: string;
    officeLocationId?: string;
    joiningDate?: string;
    leavingDate?: string;
    address?: string;
    isActive?: boolean;
}
