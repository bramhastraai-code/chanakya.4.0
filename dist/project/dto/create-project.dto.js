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
exports.UpdateProjectDto = exports.CreateProjectDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_enum_1 = require("../enum/project.enum");
const create_property_dto_1 = require("../../property/dto/create-property.dto");
const status_enum_1 = require("../../common/enum/status.enum");
const property_enum_1 = require("../../property/enum/property.enum");
class NearbyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource name', example: 'Hospital' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NearbyDto.prototype, "resource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Distance to the resource in meters',
        example: 500,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NearbyDto.prototype, "distance", void 0);
class CreateProjectDto {
    constructor() {
        this.exclusive = false;
    }
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The id of the project',
        example: '#XXXXXXX',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "listingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the project',
        example: 'Project Alpha',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "projectName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The description of the project',
        example: 'Project Alpha is awesome ',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The thumbnail URL of the project',
        example: 'http://example.com/thumbnail.jpg',
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the builder',
        example: '60d0fe4f5311236168a109ca',
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "builder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of the project',
        example: 'Residential',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "projectType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Indicates if the project is available for quick buy',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "quickBuy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Is the property available for PG?',
        enum: project_enum_1.ProjectCategory,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(project_enum_1.ProjectCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "projectCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Is the property is luxury or affordable?',
        enum: project_enum_1.ProjectAffordability,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(project_enum_1.ProjectAffordability),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "projectAffordability", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The status of the project',
        example: 'Active',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "projectStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Max Price of property',
        example: ['2bhk', '3bhk'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(property_enum_1.BHKConfiguration, { each: true }),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "PropertyConfig", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Average Price of property',
        example: 20000,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "priceAverage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Min Price of property',
        example: 20000,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Mon carpet area of property',
        example: 1000000,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "minCarpetArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'max carpet of property',
        example: 20000,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "maxCarpetArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Max Price of property',
        example: 1000000,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "priceMax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'project start from ',
        example: 2022,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "since", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Full address of the property',
        example: '123 Main Street, Downtown',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'City where the property is located',
        example: 'New York',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'State where the property is located',
        example: 'New York',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'region name',
        example: 'Manhattan',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Landmark near the project',
        example: 'Near Central Park',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "landmark", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Distance from the main road in meters',
        example: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "roadDistance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Latitude for project location',
        example: '40.712776',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Longitude for project location',
        example: '-74.005974',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Country where the project is located',
        example: 'USA',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Pincode/ZIP code of the project location',
        example: '10001',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "pinCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'List of amenity IDs',
        type: [String],
        example: ['60d5f447c1375b6b4c8f6a2f'],
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'List of facility IDs',
        type: [String],
        example: ['60d5f447c1375b6b4c8f6a2f'],
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "facilities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'List of inquiry IDs',
        type: [String],
        example: ['60d5f447c1375b6b4c8f6a2f'],
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "inquiries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'List of tags associated with the property',
        type: [create_property_dto_1.TagDto],
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'List of tags associated with the property',
        type: [create_property_dto_1.OfferDto],
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "offers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'status of property active inactive ',
        enum: status_enum_1.Status,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(status_enum_1.Status),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of image URLs',
        example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SEO title',
        example: 'Project Alpha - Best Project',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "seoTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'readyToPossessDate',
        example: '03 dec 2024',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "readyToPossessDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SEO description',
        example: 'Description of Project Alpha',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "seoDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Video link of the property',
        example: 'https://example.com/video.mp4',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "videoLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Floor pLan Url',
        required: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "floorPlan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Master Plan Url',
        required: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "masterPlan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SEO keywords',
        example: ['project', 'alpha', 'best'],
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "seoKeywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RERA number',
        example: 'RERA1234567',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "reraNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Indicates if the property is featured',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Indicates if the property is featured',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "exclusive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'View count', example: 100, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "view", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active status of the project',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [NearbyDto],
        description: 'Nearby resources with distances',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => NearbyDto),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "nearby", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Creation date',
        example: '2024-08-25T10:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateProjectDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Last update date',
        example: '2024-08-26T10:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateProjectDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'created by',
        example: '60d0fe4f5311236168a109ca',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Executive User ',
        example: '60d0fe4f5311236168a109ca',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "executiveUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'updated by ',
        example: '60d0fe4f5311236168a109ca',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "updatedBy", void 0);
class UpdateProjectDto extends (0, swagger_1.PartialType)(CreateProjectDto) {
}
exports.UpdateProjectDto = UpdateProjectDto;
//# sourceMappingURL=create-project.dto.js.map