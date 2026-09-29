import { ScopedUser } from '../common/utils/branch-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
export declare class BranchesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: ScopedUser): never[] | import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        address: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        city: string | null;
    }[]>;
    findOne(id: string, user: ScopedUser): Promise<{
        name: string;
        address: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        city: string | null;
    }>;
    create(dto: CreateBranchDto): import(".prisma/client").Prisma.Prisma__BranchClient<{
        name: string;
        address: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        city: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateBranchDto, user: ScopedUser): Promise<{
        name: string;
        address: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        city: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        address: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        city: string | null;
    }>;
}
