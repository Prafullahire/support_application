import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
export declare class DepartmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(branchId?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
