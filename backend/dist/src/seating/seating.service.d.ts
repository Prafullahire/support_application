import { PrismaService } from '../prisma/prisma.service';
import { CreateSeatingRecordDto, UpdateSeatingRecordDto } from './dto/seating.dto';
export declare class SeatingService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(branchId?: string, date?: string): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
        };
    } & {
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        floor: string;
        zone: string | null;
        totalSeats: number;
        occupiedSeats: number;
        recordDate: Date;
    })[]>;
    findOne(id: string): Promise<{
        branch: {
            name: string;
            id: string;
        };
    } & {
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        floor: string;
        zone: string | null;
        totalSeats: number;
        occupiedSeats: number;
        recordDate: Date;
    }>;
    create(dto: CreateSeatingRecordDto): import(".prisma/client").Prisma.Prisma__SeatingRecordClient<{
        branch: {
            name: string;
            id: string;
        };
    } & {
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        floor: string;
        zone: string | null;
        totalSeats: number;
        occupiedSeats: number;
        recordDate: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateSeatingRecordDto): Promise<{
        branch: {
            name: string;
            id: string;
        };
    } & {
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        floor: string;
        zone: string | null;
        totalSeats: number;
        occupiedSeats: number;
        recordDate: Date;
    }>;
    remove(id: string): Promise<{
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        floor: string;
        zone: string | null;
        totalSeats: number;
        occupiedSeats: number;
        recordDate: Date;
    }>;
}
