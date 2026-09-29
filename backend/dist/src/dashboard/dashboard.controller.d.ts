import { DashboardService } from './dashboard.service';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class DashboardController {
    private service;
    constructor(service: DashboardService);
    getSummary(user: ScopedUser, branchId?: string): Promise<{
        role: import("../common/enums").UserRole;
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
}
