import { AssetStatus } from '../common/enums';
import { AssetsService } from './assets.service';
import { AssignAssetDto, CreateAssetCategoryDto, CreateAssetDto, ReturnAssetDto, UpdateAssetCategoryDto, UpdateAssetDto } from './dto/asset.dto';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class AssetsController {
    private service;
    constructor(service: AssetsService);
    findAll(user: ScopedUser, branchId?: string, status?: AssetStatus): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
        } | null;
        category: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        description: string | null;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AssetStatus;
        serialNumber: string | null;
        categoryId: string | null;
        employeeCode: string | null;
        employeeName: string | null;
        location: string | null;
        purchaseDate: Date | null;
        assignedDate: Date | null;
        warrantyEnd: Date | null;
    })[]>;
    findAllCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createCategory(dto: CreateAssetCategoryDto): import(".prisma/client").Prisma.Prisma__AssetCategoryClient<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateCategory(id: string, dto: UpdateAssetCategoryDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        category: {
            name: string;
            id: string;
        } | null;
        assignments: ({
            user: {
                firstName: string;
                lastName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            assignedAt: Date;
            condition: string | null;
            notes: string | null;
            assetId: string;
            returnedAt: Date | null;
        })[];
    } & {
        name: string;
        description: string | null;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AssetStatus;
        serialNumber: string | null;
        categoryId: string | null;
        employeeCode: string | null;
        employeeName: string | null;
        location: string | null;
        purchaseDate: Date | null;
        assignedDate: Date | null;
        warrantyEnd: Date | null;
    }>;
    create(dto: CreateAssetDto): import(".prisma/client").Prisma.Prisma__AssetClient<{
        branch: {
            name: string;
            id: string;
        } | null;
        category: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        description: string | null;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AssetStatus;
        serialNumber: string | null;
        categoryId: string | null;
        employeeCode: string | null;
        employeeName: string | null;
        location: string | null;
        purchaseDate: Date | null;
        assignedDate: Date | null;
        warrantyEnd: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateAssetDto): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        category: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        description: string | null;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AssetStatus;
        serialNumber: string | null;
        categoryId: string | null;
        employeeCode: string | null;
        employeeName: string | null;
        location: string | null;
        purchaseDate: Date | null;
        assignedDate: Date | null;
        warrantyEnd: Date | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        description: string | null;
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AssetStatus;
        serialNumber: string | null;
        categoryId: string | null;
        employeeCode: string | null;
        employeeName: string | null;
        location: string | null;
        purchaseDate: Date | null;
        assignedDate: Date | null;
        warrantyEnd: Date | null;
    }>;
    assign(id: string, dto: AssignAssetDto): Promise<{
        user: {
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        assignedAt: Date;
        condition: string | null;
        notes: string | null;
        assetId: string;
        returnedAt: Date | null;
    }>;
    returnAsset(id: string, dto: ReturnAssetDto): Promise<{
        user: {
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        assignedAt: Date;
        condition: string | null;
        notes: string | null;
        assetId: string;
        returnedAt: Date | null;
    }>;
}
