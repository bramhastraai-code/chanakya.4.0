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
exports.CreatePropertyDto = exports.OfferDto = exports.TagDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const property_enum_1 = require("../enum/property.enum");
const status_enum_1 = require("../../common/enum/status.enum");
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
    __metadata("design:type", String)
], NearbyDto.prototype, "distance", void 0);
class TagDto {
}
exports.TagDto = TagDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Text of the tag',
        example: 'new',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TagDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant of the tag',
        enum: property_enum_1.TagVariant,
        example: 'feature',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(property_enum_1.TagVariant),
    __metadata("design:type", String)
], TagDto.prototype, "variant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL of the icon associated with the tag',
        example: 'https://example.com/icon.png',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TagDto.prototype, "iconUrl", void 0);
class OfferDto {
}
exports.OfferDto = OfferDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Text of the offer',
        example: 'new',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OfferDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant of the offer',
        enum: property_enum_1.OfferVariant,
        example: 'promo',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(property_enum_1.OfferVariant),
    __metadata("design:type", String)
], OfferDto.prototype, "variant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Text of the offer',
        example: '20% off',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OfferDto.prototype, "description", void 0);
class CreatePropertyDto {
}
exports.CreatePropertyDto = CreatePropertyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The id of the project',
        example: '#XXXXXXX',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "listingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property title',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property title',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "propertyTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property description',
        example: 'A spacious 3 BHK apartment with sea view.',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "propertyDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property Owner',
        example: 'Rakesh',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "propertyOwner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property owner number',
        example: '+919993313+++.',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "ownerNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property Executive',
        example: 'Yogesh',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "propertyExecutive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of property',
        enum: property_enum_1.PropertyType,
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(property_enum_1.PropertyType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "propertyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Purpose of property',
        enum: property_enum_1.PropertyPurpose,
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(property_enum_1.PropertyPurpose),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "propertyPurpose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Status of the property',
        enum: property_enum_1.PropertyStatus,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(property_enum_1.PropertyStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "propertyStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Status of the property',
        enum: property_enum_1.PropertyLabel,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(property_enum_1.PropertyLabel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "propertyLabel", void 0);
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
], CreatePropertyDto.prototype, "nearby", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Category of the property',
        enum: property_enum_1.PropertyCategory,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(property_enum_1.PropertyCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "propertyCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'BHK configuration',
        enum: property_enum_1.BHKConfiguration,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(property_enum_1.BHKConfiguration),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "bhkConfiguration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Furnishing status',
        enum: property_enum_1.FurnishingStatus,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(property_enum_1.FurnishingStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "furnishingStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Age of the property in years',
        example: 5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "propertyAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Age of the property in months',
        example: 6,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "propertyAgeMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Total area of the property in square feet',
        example: 1500,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "totalArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Carpet area of the property in square feet',
        example: 1200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "carpetArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Number of balconies',
        example: 2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "balconyCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Number of bathrooms',
        example: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "bathroomCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Number of beds',
        example: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "bedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Number of parking spaces',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "parkingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Floor number',
        example: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "floorNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Total number of floors in the building',
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "totalFloors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Facing direction of the property',
        enum: property_enum_1.FacingDirection,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(property_enum_1.FacingDirection),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "facingDirection", void 0);
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
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "amenities", void 0);
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
], CreatePropertyDto.prototype, "facilities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Full address of the property',
        example: '123 Main Street, Downtown',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'City where the property is located',
        example: 'New York',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'State where the property is located',
        example: 'New York',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'region name',
        example: 'Manhattan',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Landmark near the property',
        example: 'Near Central Park',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "landmark", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Distance from the main road in meters',
        example: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "roadDistance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Latitude for property location',
        example: '40.712776',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Longitude for property location',
        example: '-74.005974',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Country where the property is located',
        example: 'USA',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Pincode/ZIP code of the property location',
        example: '10001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "pinCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Property price',
        example: 1000000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Price per unit (e.g., per square foot)',
        example: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "pricePerUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Maintenance charge',
        example: 5000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "maintenanceCharge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Deposit amount',
        example: 20000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "deposit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Total price of the property',
        example: 1200000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Images Url ',
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Video link of the property',
        example: 'https://example.com/video.mp4',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "videoLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Floor pLan Url',
        required: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "floorPlan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Master Plan Url',
        required: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "masterPlan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'SEO title for the property page',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "seoTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'SEO description for the property page',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "seoDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'SEO keywords for the property page',
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "seoKeywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Description of the washroom',
        example: 'Common washroom for guests',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "washroomFor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Type of the plot',
        enum: property_enum_1.PlotType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "plotType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Is the property available for PG?',
        enum: property_enum_1.PGAvailableFor,
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsEnum)(property_enum_1.PGAvailableFor),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "pgAvailableFor", void 0);
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
], CreatePropertyDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'ID of the builder',
        example: '60d5f447c1375b6b4c8f6a2f',
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "builderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'ID of the project',
        example: '60d5f447c1375b6b4c8f6a30',
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)((params) => (params.value === '' ? null : params.value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'List of tags associated with the property',
        type: [TagDto],
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'List of tags associated with the property',
        type: [OfferDto],
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null && value !== undefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "offers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Indicates if the property is featured',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePropertyDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'ID of the user who created the property',
        example: '60d5f447c1375b6b4c8f6a31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'ID of the Customer who owned the property',
        example: '60d5f447c1375b6b4c8f6a31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'ID of the user who updated the property',
        example: '60d5f447c1375b6b4c8f6a32',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'ID of the owner (Agent/Builder who created the property)',
        example: '60d5f447c1375b6b4c8f6a33',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Number of views',
        example: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "views", void 0);
//# sourceMappingURL=create-property.dto.js.map