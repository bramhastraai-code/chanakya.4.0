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
exports.CreateSavedDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
class CreateSavedDto {
}
exports.CreateSavedDto = CreateSavedDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the user who saved the item',
        example: '60d5f4c71c4d88c154a98192',
    }),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateSavedDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the saved project',
        example: '60d5f4c71c4d88c154a98193',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateSavedDto.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the saved property',
        example: '60d5f4c71c4d88c154a98194',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateSavedDto.prototype, "property", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates whether the saved item is active',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateSavedDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-saved.dto.js.map