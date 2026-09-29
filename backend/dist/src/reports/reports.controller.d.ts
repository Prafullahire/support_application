import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report.dto';
import { ScopedUser } from '../common/utils/branch-scope.util';
export declare class ReportsController {
    private service;
    constructor(service: ReportsService);
    getDashboardStats(user: ScopedUser, query: ReportQueryDto): Promise<{
        requests: {
            total: number;
            pending: number;
        };
        assets: {
            total: number;
            assigned: number;
        };
        expenses: {
            totalAmount: number | import("@prisma/client/runtime/library").Decimal;
            count: number;
        };
        expenseSummary: {
            grandTotal: number;
            totalCount: number;
            entityWise: {
                entityId: string;
                entityName: string;
                total: number;
                count: number;
                branches: {
                    branchId: string;
                    branchName: string;
                    total: number;
                    count: number;
                }[];
            }[];
            branchWise: {
                branchId: string;
                branchName: string;
                total: number;
                count: number;
            }[];
        };
        amc: {
            expiringSoon: number;
        };
        pg: {
            active: number;
        };
        stock: {
            lowJoiningKit: number;
            lowBrochures: number;
        };
    }>;
    getExpenseSummary(user: ScopedUser, query: ReportQueryDto): Promise<{
        grandTotal: number;
        totalCount: number;
        entityWise: {
            entityId: string;
            entityName: string;
            total: number;
            count: number;
            branches: {
                branchId: string;
                branchName: string;
                total: number;
                count: number;
            }[];
        }[];
        branchWise: {
            branchId: string;
            branchName: string;
            total: number;
            count: number;
        }[];
    }>;
    exportExcel(user: ScopedUser, module: string, query: ReportQueryDto, res: Response): Promise<void>;
}
