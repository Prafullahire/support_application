"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportsService = void 0;
const common_1 = require("@nestjs/common");
const XLSX = __importStar(require("xlsx"));
const prisma_service_1 = require("../prisma/prisma.service");
let ImportsService = class ImportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async importFromXlsx(file, module, userId, branchId) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const job = await this.prisma.importJob.create({
            data: {
                module,
                fileName: file.originalname,
                status: 'PROCESSING',
                totalRows: rows.length,
                branchId,
                createdBy: userId,
            },
        });
        let successRows = 0;
        let failedRows = 0;
        const errors = [];
        for (let i = 0; i < rows.length; i++) {
            try {
                await this.importRow(module, rows[i], branchId);
                successRows++;
            }
            catch (err) {
                failedRows++;
                errors.push(`Row ${i + 2}: ${err.message}`);
            }
        }
        return this.prisma.importJob.update({
            where: { id: job.id },
            data: {
                status: failedRows === 0 ? 'COMPLETED' : 'COMPLETED_WITH_ERRORS',
                successRows,
                failedRows,
                errors: errors.length ? errors.join('\n') : null,
            },
        });
    }
    findAllJobs() {
        return this.prisma.importJob.findMany({ orderBy: { createdAt: 'desc' } });
    }
    findOneJob(id) {
        return this.prisma.importJob.findUnique({ where: { id } });
    }
    async importRow(module, row, branchId) {
        switch (module) {
            case 'vendors':
                await this.prisma.vendor.create({
                    data: {
                        name: String(row.name || row.Name),
                        contact: row.contact ? String(row.contact) : undefined,
                        email: row.email ? String(row.email) : undefined,
                        phone: row.phone ? String(row.phone) : undefined,
                        address: row.address ? String(row.address) : undefined,
                    },
                });
                break;
            case 'departments':
                await this.prisma.department.create({
                    data: {
                        name: String(row.name || row.Name),
                        branchId: branchId || (row.branchId ? String(row.branchId) : undefined),
                    },
                });
                break;
            case 'assets':
                await this.prisma.asset.create({
                    data: {
                        name: String(row.name || row.Name),
                        serialNumber: row.serialNumber ? String(row.serialNumber) : undefined,
                        branchId: branchId || (row.branchId ? String(row.branchId) : undefined),
                    },
                });
                break;
            default:
                throw new common_1.BadRequestException(`Unsupported import module: ${module}`);
        }
    }
};
exports.ImportsService = ImportsService;
exports.ImportsService = ImportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImportsService);
//# sourceMappingURL=imports.service.js.map