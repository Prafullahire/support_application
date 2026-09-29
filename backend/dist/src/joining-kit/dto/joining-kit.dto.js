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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnJoiningKitDto = exports.IssueJoiningKitDto = exports.IssueKitItemDto = exports.UpsertJoiningKitStockDto = exports.UpdateJoiningKitItemDto = exports.CreateJoiningKitItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateJoiningKitItemDto {
}
exports.CreateJoiningKitItemDto = CreateJoiningKitItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJoiningKitItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJoiningKitItemDto.prototype, "description", void 0);
class UpdateJoiningKitItemDto {
}
exports.UpdateJoiningKitItemDto = UpdateJoiningKitItemDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJoiningKitItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJoiningKitItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateJoiningKitItemDto.prototype, "isActive", void 0);
class UpsertJoiningKitStockDto {
}
exports.UpsertJoiningKitStockDto = UpsertJoiningKitStockDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertJoiningKitStockDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertJoiningKitStockDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpsertJoiningKitStockDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpsertJoiningKitStockDto.prototype, "minStock", void 0);
class IssueKitItemDto {
}
exports.IssueKitItemDto = IssueKitItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueKitItemDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], IssueKitItemDto.prototype, "quantity", void 0);
class IssueJoiningKitDto {
}
exports.IssueJoiningKitDto = IssueJoiningKitDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueJoiningKitDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueJoiningKitDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => IssueKitItemDto),
    __metadata("design:type", Array)
], IssueJoiningKitDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueJoiningKitDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueJoiningKitDto.prototype, "employeeName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueJoiningKitDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueJoiningKitDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], IssueJoiningKitDto.prototype, "joiningDate", void 0);
class ReturnJoiningKitDto {
}
exports.ReturnJoiningKitDto = ReturnJoiningKitDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReturnJoiningKitDto.prototype, "notes", void 0);
//# sourceMappingURL=joining-kit.dto.js.map