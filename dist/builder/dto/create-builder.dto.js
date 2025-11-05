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
exports.CreateBuilderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateBuilderDto {
}
exports.CreateBuilderDto = CreateBuilderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the builder',
        example: 'John Doe Constructions',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The description of the builder',
        example: 'John Doe Constructions description',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The phone number of the builder',
        example: '+1234567890',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The email address of the builder',
        example: 'builder@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The alternate phone number of the builder',
        example: '+0987654321',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "alternatePhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBuilderDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBuilderDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "pinCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The logo URL of the builder',
        example: 'http://example.com/logo.png',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of inquiry IDs associated with the builder',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], CreateBuilderDto.prototype, "inquiries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The owner of the builder (Customer ID)',
        type: String,
        example: '60f7f5f6c8d3c7f1b0f1d1b4',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The user ID who created the builder',
        example: '60f7f5f6c8d3c7f1b0f1d1b2',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The user ID who last updated the builder',
        example: '60f7f5f6c8d3c7f1b0f1d1b3',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of views for the builder',
        example: 100,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBuilderDto.prototype, "views", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: ' builder from the date ',
        example: 100,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBuilderDto.prototype, "since", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'status',
        example: 'active',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "status", void 0);
//# sourceMappingURL=create-builder.dto.js.map