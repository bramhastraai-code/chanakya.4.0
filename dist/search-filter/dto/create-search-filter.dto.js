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
exports.PaginationDto = exports.CreateSearchDto = exports.CreateSearchFilterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateSearchFilterDto {
}
exports.CreateSearchFilterDto = CreateSearchFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter for the search, such as term or category.',
        example: 'real estate',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSearchFilterDto.prototype, "filter", void 0);
class CreateSearchDto {
}
exports.CreateSearchDto = CreateSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique identifier for the user.',
        example: '12345',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSearchDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The search term that the user entered.',
        example: 'apartment for rent',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSearchDto.prototype, "term", void 0);
class PaginationDto {
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The page number for pagination',
        default: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Page must be a positive integer starting from 1' }),
    (0, class_transformer_1.Transform)(({ value }) => Number(value), { toClassOnly: true }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The limit of items per page for pagination',
        default: 10,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Limit must be a positive integer greater than 0' }),
    (0, class_validator_1.Max)(100, { message: 'Limit cannot exceed 100' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 10), { toClassOnly: true }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
//# sourceMappingURL=create-search-filter.dto.js.map