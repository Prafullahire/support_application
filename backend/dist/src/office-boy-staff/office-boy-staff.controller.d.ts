import { ScopedUser } from '../common/utils/branch-scope.util';
import { OfficeBoyStaffService } from './office-boy-staff.service';
import { CreateOfficeBoyStaffDto, UpdateOfficeBoyStaffDto } from './dto/office-boy-staff.dto';
export declare class OfficeBoyStaffController {
    private service;
    constructor(service: OfficeBoyStaffService);
    findAll(user: ScopedUser, branchId?: string): import(".prisma/client").Prisma.PrismaPromise<{
        branch: {
            name: string;
            id: string;
            code: string;
        } | null;
        officeLocation: {
            name: string;
            id: string;
            latitude: import("@prisma/client/runtime/library").Decimal;
            longitude: import("@prisma/client/runtime/library").Decimal;
            allowedRadiusMeters: number;
        } | null;
        email: string;
        phone: string | null;
        firstName: string;
        lastName: string;
        branchId: string | null;
        officeLocationId: string | null;
        joiningDate: Date | null;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        employeeId: string | null;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        branch: {
            name: string;
            id: string;
            code: string;
        } | null;
        officeLocation: {
            name: string;
            id: string;
            latitude: import("@prisma/client/runtime/library").Decimal;
            longitude: import("@prisma/client/runtime/library").Decimal;
            allowedRadiusMeters: number;
        } | null;
        email: string;
        phone: string | null;
        firstName: string;
        lastName: string;
        branchId: string | null;
        officeLocationId: string | null;
        joiningDate: Date | null;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        employeeId: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    create(dto: CreateOfficeBoyStaffDto): Promise<{
        branch: {
            name: string;
            id: string;
            code: string;
        } | null;
        officeLocation: {
            name: string;
            id: string;
            latitude: import("@prisma/client/runtime/library").Decimal;
            longitude: import("@prisma/client/runtime/library").Decimal;
            allowedRadiusMeters: number;
        } | null;
        email: string;
        phone: string | null;
        firstName: string;
        lastName: string;
        branchId: string | null;
        officeLocationId: string | null;
        joiningDate: Date | null;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        employeeId: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateOfficeBoyStaffDto): Promise<{
        branch: {
            name: string;
            id: string;
            code: string;
        } | null;
        officeLocation: {
            name: string;
            id: string;
            latitude: import("@prisma/client/runtime/library").Decimal;
            longitude: import("@prisma/client/runtime/library").Decimal;
            allowedRadiusMeters: number;
        } | null;
        email: string;
        phone: string | null;
        firstName: string;
        lastName: string;
        branchId: string | null;
        officeLocationId: string | null;
        joiningDate: Date | null;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        employeeId: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        department: {
            name: string;
            id: string;
        } | null;
        officeLocation: {
            name: string;
            id: string;
        } | null;
        email: string;
        phone: string | null;
        firstName: string;
        lastName: string;
        branchId: string | null;
        officeLocationId: string | null;
        joiningDate: Date | null;
        leavingDate: Date | null;
        address: string | null;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        departmentId: string | null;
        employeeId: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
}
