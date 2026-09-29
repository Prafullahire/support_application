import { PrismaService } from '../prisma/prisma.service';
import { ReportQueryDto } from './dto/report.dto';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(query: ReportQueryDto): Promise<{
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
    getExpenseSummary(query: ReportQueryDto): Promise<{
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
    exportToExcel(module: string, query: ReportQueryDto): Promise<Buffer>;
    private flattenRow;
}
