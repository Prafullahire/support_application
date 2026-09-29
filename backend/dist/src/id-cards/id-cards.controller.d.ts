import { IdCardsService } from './id-cards.service';
import { AssignIdCardDto, CreateIdCardDto, UpdateIdCardDto } from './dto/id-card.dto';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class IdCardsController {
    private service;
    constructor(service: IdCardsService);
    findAll(user: ScopedUser, branchId?: string, availableOnly?: string): import(".prisma/client").Prisma.PrismaPromise<({
        branch: {
            name: string;
            id: string;
        } | null;
        assignedTo: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        } | null;
    } & {
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        cardNumber: string;
        assignedAt: Date | null;
        isAvailable: boolean;
        receivedDate: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        assignedTo: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        } | null;
    } & {
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        cardNumber: string;
        assignedAt: Date | null;
        isAvailable: boolean;
        receivedDate: Date | null;
    }>;
    create(dto: CreateIdCardDto): import(".prisma/client").Prisma.Prisma__IdCardClient<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        cardNumber: string;
        assignedAt: Date | null;
        isAvailable: boolean;
        receivedDate: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateIdCardDto): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        assignedTo: {
            firstName: string;
            lastName: string;
            id: string;
        } | null;
    } & {
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        cardNumber: string;
        assignedAt: Date | null;
        isAvailable: boolean;
        receivedDate: Date | null;
    }>;
    remove(id: string): Promise<{
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        cardNumber: string;
        assignedAt: Date | null;
        isAvailable: boolean;
        receivedDate: Date | null;
    }>;
    assign(id: string, dto: AssignIdCardDto): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        assignedTo: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        } | null;
    } & {
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        cardNumber: string;
        assignedAt: Date | null;
        isAvailable: boolean;
        receivedDate: Date | null;
    }>;
    unassign(id: string): Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        branchId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
        cardNumber: string;
        assignedAt: Date | null;
        isAvailable: boolean;
        receivedDate: Date | null;
    }>;
}
