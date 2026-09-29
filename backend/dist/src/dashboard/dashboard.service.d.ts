import { UserRole } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getSummary(userId: string, role: UserRole, branchId?: string): Promise<{
        role: UserRole;
        totalRequests: number;
        pendingRequests: number;
        completedRequests: number;
        totalAssets: number;
        availableAssets: number;
        totalExpenses: number;
        expiringAmc: number;
        lowStockItems: number;
        unreadNotifications: number;
    }>;
    private getLowStockJoiningKitCount;
    private getLowStockBrochureCount;
}
