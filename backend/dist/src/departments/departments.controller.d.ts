import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class DepartmentsController {
    private service;
    constructor(service: DepartmentsService);
    findAll(user: ScopedUser, branchId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        branchId: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        branchId: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateDepartmentDto): import(".prisma/client").Prisma.Prisma__DepartmentClient<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        branchId: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateDepartmentDto): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        branchId: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        name: string;
        branchId: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
