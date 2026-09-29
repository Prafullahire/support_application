import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto, UpdateVendorDto } from './dto/vendor.dto';
export declare class VendorsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activeOnly?: boolean): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        contact: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        contact: string | null;
    }>;
    create(dto: CreateVendorDto): import(".prisma/client").Prisma.Prisma__VendorClient<{
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        contact: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateVendorDto): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        contact: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        contact: string | null;
    }>;
}
