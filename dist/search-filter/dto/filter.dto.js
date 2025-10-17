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
exports.PropertyFilter_V2_Dto = exports.PropertyFilterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const search_enum_1 = require("../enum/search.enum");
const property_enum_1 = require("../../property/enum/property.enum");
class PropertyFilterDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.type = search_enum_1.EntityType.PROPERTY;
    }
}
exports.PropertyFilterDto = PropertyFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query for title, description, and location',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PropertyFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by city' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PropertyFilterDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Current page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PropertyFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Limit per page', default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PropertyFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of entity to search for',
        enum: search_enum_1.EntityType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(search_enum_1.EntityType),
    __metadata("design:type", String)
], PropertyFilterDto.prototype, "type", void 0);
class PropertyFilter_V2_Dto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.type = search_enum_1.EntityType.PROPERTY;
    }
}
exports.PropertyFilter_V2_Dto = PropertyFilter_V2_Dto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query for title, description, and location',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PropertyFilter_V2_Dto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by city' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PropertyFilter_V2_Dto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Current page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PropertyFilter_V2_Dto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Limit per page', default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PropertyFilter_V2_Dto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of entity to search for',
        enum: search_enum_1.EntityType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(search_enum_1.EntityType),
    __metadata("design:type", String)
], PropertyFilter_V2_Dto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum price filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PropertyFilter_V2_Dto.prototype, "minPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum price filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PropertyFilter_V2_Dto.prototype, "maxPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum area filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PropertyFilter_V2_Dto.prototype, "minArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum area filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PropertyFilter_V2_Dto.prototype, "maxArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort options (priceAsc, priceDesc, areaAsc, areaDesc)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PropertyFilter_V2_Dto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by property type (e.g., Residential, Commercial)',
        type: property_enum_1.PropertyType,
        enum: property_enum_1.PropertyType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PropertyFilter_V2_Dto.prototype, "propertyType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by property configurations (e.g., 1BHK, 2BHK)',
        type: [property_enum_1.BHKConfiguration],
        enum: property_enum_1.BHKConfiguration,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(property_enum_1.BHKConfiguration, { each: true }),
    __metadata("design:type", Array)
], PropertyFilter_V2_Dto.prototype, "propertyConfig", void 0);
//# sourceMappingURL=filter.dto.js.map