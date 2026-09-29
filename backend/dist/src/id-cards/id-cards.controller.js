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
exports.IdCardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const id_cards_service_1 = require("./id-cards.service");
const id_card_dto_1 = require("./dto/id-card.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const branch_scope_util_1 = require("../common/utils/branch-scope.util");
let IdCardsController = class IdCardsController {
    constructor(service) {
        this.service = service;
    }
    findAll(user, branchId, availableOnly) {
        const scope = (0, branch_scope_util_1.resolveBranchFilter)(user, branchId);
        return this.service.findAll(scope.branchId, availableOnly === 'true');
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
    assign(id, dto) {
        return this.service.assign(id, dto);
    }
    unassign(id) {
        return this.service.unassign(id);
    }
};
exports.IdCardsController = IdCardsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('branchId')),
    __param(2, (0, common_1.Query)('availableOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], IdCardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IdCardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_card_dto_1.CreateIdCardDto]),
    __metadata("design:returntype", void 0)
], IdCardsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, id_card_dto_1.UpdateIdCardDto]),
    __metadata("design:returntype", void 0)
], IdCardsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IdCardsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, id_card_dto_1.AssignIdCardDto]),
    __metadata("design:returntype", void 0)
], IdCardsController.prototype, "assign", null);
__decorate([
    (0, common_1.Patch)(':id/unassign'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IdCardsController.prototype, "unassign", null);
exports.IdCardsController = IdCardsController = __decorate([
    (0, swagger_1.ApiTags)('id-cards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('id-cards'),
    __metadata("design:paramtypes", [id_cards_service_1.IdCardsService])
], IdCardsController);
//# sourceMappingURL=id-cards.controller.js.map