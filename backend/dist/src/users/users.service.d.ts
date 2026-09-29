import { Prisma } from '@prisma/client';
import { ScopedUser } from '../common/utils/branch-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserWelcomeNotificationService } from './user-welcome-notification.service';
export declare class UsersService {
    private prisma;
    private welcomeNotificationService;
    constructor(prisma: PrismaService, welcomeNotificationService: UserWelcomeNotificationService);
    findAll(actor?: ScopedUser): Prisma.PrismaPromise<{
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
    findOne(id: string, actor?: ScopedUser): Promise<{
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
    create(dto: CreateUserDto, actor?: ScopedUser): Promise<{
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
    update(id: string, dto: UpdateUserDto, actor?: ScopedUser): Promise<{
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
    remove(id: string, actor?: ScopedUser): Promise<{
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
    private buildUserData;
    private resolveDefaultLocation;
    private validateOfficeBoyFields;
    private validatePhoneUnique;
    private validateUnique;
    private select;
}
