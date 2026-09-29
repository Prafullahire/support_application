export declare class CreateOfficeBoyStaffDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    employeeId?: string;
    password: string;
    branchId: string;
    officeLocationId?: string;
    isActive?: boolean;
}
export declare class UpdateOfficeBoyStaffDto {
    firstName?: string;
    lastName?: string;
    employeeId?: string;
    phone?: string;
    email?: string;
    password?: string;
    branchId?: string;
    officeLocationId?: string;
    isActive?: boolean;
}
