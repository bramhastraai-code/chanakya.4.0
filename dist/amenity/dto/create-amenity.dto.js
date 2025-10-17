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
exports.CreateAmenityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateAmenityDto {
}
exports.CreateAmenityDto = CreateAmenityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the amenity',
        example: 'Swimming Pool',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmenityDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The description of the amenity',
        example: 'Swimming Pool is beautiful',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmenityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: ' icon image URL for the amenity',
        example: 'https://picsum.photos/200',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], CreateAmenityDto.prototype, "iconImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the user who created the amenity',
        example: '60d5f5c6c8e6b1a3f8a2b3c4',
        required: false,
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAmenityDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the user who last updated the amenity',
        example: '60d5f5c6c8e6b1a3f8a2b3c4',
        required: false,
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAmenityDto.prototype, "updatedBy", void 0);
//# sourceMappingURL=create-amenity.dto.js.map