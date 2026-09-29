"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrochuresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const brochures_service_1 = require("./brochures.service");
const brochure_dto_1 = require("./dto/brochure.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const branch_scope_util_1 = require("../common/utils/branch-scope.util");
let BrochuresController = class BrochuresController {
    constructor(service) {
        this.service = service;
    }
    findAllStock(user, branchId) {
        const scope = (0, branch_scope_util_1.resolveBranchFilter)(user, branchId);
        return this.service.findAllStock(scope.branchId);
    }
    findOneStock(id) {
        return this.service.findOneStock(id);
    }
    createStock(dto) {
        return this.service.createStock(dto);
    }
    updateStock(id, dto) {
        return this.service.updateStock(id, dto);
    }
    removeStock(id) {
        return this.service.removeStock(id);
    }
    findAllIssues() {
        return this.service.findAllIssues();
    }
    issueBrochure(dto) {
        return this.service.issueBrochure(dto);
    }
};
exports.BrochuresController = BrochuresController;
__decorate([
    (0, common_1.Get)('stock'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BrochuresController.prototype, "findAllStock", null);
__decorate([
    (0, common_1.Get)('stock/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrochuresController.prototype, "findOneStock", null);
__decorate([
    (0, common_1.Post)('stock'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [brochure_dto_1.CreateBrochureStockDto]),
    __metadata("design:returntype", void 0)
], BrochuresController.prototype, "createStock", null);
__decorate([
    (0, common_1.Put)('stock/:id'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, brochure_dto_1.UpdateBrochureStockDto]),
    __metadata("design:returntype", void 0)
], BrochuresController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Delete)('stock/:id'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrochuresController.prototype, "removeStock", null);
__decorate([
    (0, common_1.Get)('issues'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BrochuresController.prototype, "findAllIssues", null);
__decorate([
    (0, common_1.Post)('issue'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [brochure_dto_1.IssueBrochureDto]),
    __metadata("design:returntype", void 0)
], BrochuresController.prototype, "issueBrochure", null);
exports.BrochuresController = BrochuresController = __decorate([
    (0, swagger_1.ApiTags)('brochures'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('brochures'),
    __metadata("design:paramtypes", [brochures_service_1.BrochuresService])
], BrochuresController);
//# sourceMappingURL=brochures.controller.js.map