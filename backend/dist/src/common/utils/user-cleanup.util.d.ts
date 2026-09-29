import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare function deleteUserRelations(prisma: PrismaService | Prisma.TransactionClient, userId: string): Promise<void>;
