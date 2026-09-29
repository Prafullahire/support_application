import { ScopedUser } from '../common/utils/branch-scope.util';
import { OfficeLocationsService } from './office-locations.service';
import { CreateOfficeLocationDto, UpdateOfficeLocationDto } from './dto/office-location.dto';
export declare class OfficeLocationsController {
    private service;
    constructor(service: OfficeLocationsService);
    findAll(user: ScopedUser, branchId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
            code: string;
        };
        _count: {
            staff: number;
        };
    } & {
        name: string;
        branchId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        latitude: import("@prisma/client/runtime/library").Decimal;
        longitude: import("@prisma/client/runtime/library").Decimal;
        allowedRadiusMeters: number;
    })[]>;
    findOne(id: string): Promise<{
        branch: {
            name: string;
            id: string;
            code: string;
        };
        staff: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            employeeId: string | null;
            isActive: boolean;
        }[];
    } & {
        name: string;
        branchId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        latitude: import("@prisma/client/runtime/library").Decimal;
        longitude: import("@prisma/client/runtime/library").Decimal;
        allowedRadiusMeters: number;
    }>;
    create(dto: CreateOfficeLocationDto): import(".prisma/client").Prisma.Prisma__OfficeLocationClient<{
        branch: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        branchId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        latitude: import("@prisma/client/runtime/library").Decimal;
        longitude: import("@prisma/client/runtime/library").Decimal;
        allowedRadiusMeters: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateOfficeLocationDto): Promise<{
        branch: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        branchId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        latitude: import("@prisma/client/runtime/library").Decimal;
        longitude: import("@prisma/client/runtime/library").Decimal;
        allowedRadiusMeters: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        branchId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        latitude: import("@prisma/client/runtime/library").Decimal;
        longitude: import("@prisma/client/runtime/library").Decimal;
        allowedRadiusMeters: number;
    }>;
}
