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
exports.JoiningKitController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const joining_kit_service_1 = require("./joining-kit.service");
const joining_kit_dto_1 = require("./dto/joining-kit.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const branch_scope_util_1 = require("../common/utils/branch-scope.util");
let JoiningKitController = class JoiningKitController {
    constructor(service) {
        this.service = service;
    }
    findAllItems() {
        return this.service.findAllItems();
    }
    findOneItem(id) {
        return this.service.findOneItem(id);
    }
    createItem(dto) {
        return this.service.createItem(dto);
    }
    updateItem(id, dto) {
        return this.service.updateItem(id, dto);
    }
    findAllStock(user, branchId) {
        const scope = (0, branch_scope_util_1.resolveBranchFilter)(user, branchId);
        return this.service.findAllStock(scope.branchId);
    }
    upsertStock(dto) {
        return this.service.upsertStock(dto);
    }
    findAllIssues() {
        return this.service.findAllIssues();
    }
    issueKit(dto) {
        return this.service.issueKit(dto);
    }
    returnKit(id, dto) {
        return this.service.returnKit(id, dto);
    }
};
exports.JoiningKitController = JoiningKitController;
__decorate([
    (0, common_1.Get)('items'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JoiningKitController.prototype, "findAllItems", null);
__decorate([
    (0, common_1.Get)('items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JoiningKitController.prototype, "findOneItem", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [joining_kit_dto_1.CreateJoiningKitItemDto]),
    __metadata("design:returntype", void 0)
], JoiningKitController.prototype, "createItem", null);
__decorate([
    (0, common_1.Put)('items/:id'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, joining_kit_dto_1.UpdateJoiningKitItemDto]),
    __metadata("design:returntype", void 0)
], JoiningKitController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Get)('stock'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JoiningKitController.prototype, "findAllStock", null);
__decorate([
    (0, common_1.Post)('stock'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [joining_kit_dto_1.UpsertJoiningKitStockDto]),
    __metadata("design:returntype", void 0)
], JoiningKitController.prototype, "upsertStock", null);
__decorate([
    (0, common_1.Get)('issues'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JoiningKitController.prototype, "findAllIssues", null);
__decorate([
    (0, common_1.Post)('issue'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [joining_kit_dto_1.IssueJoiningKitDto]),
    __metadata("design:returntype", void 0)
], JoiningKitController.prototype, "issueKit", null);
__decorate([
    (0, common_1.Post)('issues/:id/return'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, joining_kit_dto_1.ReturnJoiningKitDto]),
    __metadata("design:returntype", void 0)
], JoiningKitController.prototype, "returnKit", null);
exports.JoiningKitController = JoiningKitController = __decorate([
    (0, swagger_1.ApiTags)('joining-kit'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('joining-kit'),
    __metadata("design:paramtypes", [joining_kit_service_1.JoiningKitService])
], JoiningKitController);
//# sourceMappingURL=joining-kit.controller.js.map