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
exports.CreateBannerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ExecutionAreaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Region of the execution area' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecutionAreaDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City of the execution area', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecutionAreaDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country of the execution area',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecutionAreaDto.prototype, "country", void 0);
class CreateBannerDto {
}
exports.CreateBannerDto = CreateBannerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the ad banner' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the ad banner' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content type of the ad',
        enum: ['Image', 'Video'],
    }),
    (0, class_validator_1.IsEnum)(['Image', 'Video']),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL of the image if contentType is Image',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL of the video if contentType is Video',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL of the mobile ad banner image',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "imageUrlForMobile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Link associated with the ad banner' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of the ad',
        enum: ['Banner', 'Popup', 'Sidebar'],
    }),
    (0, class_validator_1.IsEnum)(['Banner', 'Popup', 'Sidebar']),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "adType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is the ad banner active?' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBannerDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date of the ad banner campaign',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateBannerDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date of the ad banner campaign',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateBannerDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional information about the ad banner',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "additionalInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Execution areas for the ad banner',
        type: [ExecutionAreaDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ExecutionAreaDto),
    __metadata("design:type", Array)
], CreateBannerDto.prototype, "executionArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Industry segment related to the ad',
        enum: [
            'RealEstate',
            'ElectricalAppliances',
            'ConstructionMaterials',
            'Services',
            'ProductRelatedToRealEstate',
        ],
    }),
    (0, class_validator_1.IsEnum)([
        'RealEstate',
        'ElectricalAppliances',
        'ConstructionMaterials',
        'Services',
        'ProductRelatedToRealEstate',
    ]),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "industrySegment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID of the creator', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID of the updater', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "updatedBy", void 0);
//# sourceMappingURL=create-banner.dto.js.map