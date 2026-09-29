import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class UsersController {
    private service;
    constructor(service: UsersService);
    findAll(user: ScopedUser): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findOne(id: string, user: ScopedUser): Promise<{
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
    create(dto: CreateUserDto, user: ScopedUser): Promise<{
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
    update(id: string, dto: UpdateUserDto, user: ScopedUser): Promise<{
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
    remove(id: string, user: ScopedUser): Promise<{
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
