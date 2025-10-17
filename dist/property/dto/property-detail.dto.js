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
exports.PropertyDetailDto = exports.EnquiryDetailDto = exports.CrmDetailsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const property_enum_1 = require("../enum/property.enum");
class CrmDetailsDto {
}
exports.CrmDetailsDto = CrmDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Some CRM data' }),
    __metadata("design:type", String)
], CrmDetailsDto.prototype, "crmName", void 0);
class EnquiryDetailDto {
}
exports.EnquiryDetailDto = EnquiryDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345' }),
    __metadata("design:type", String)
], EnquiryDetailDto.prototype, "listingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Luxury Apartment' }),
    __metadata("design:type", String)
], EnquiryDetailDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120000 }),
    __metadata("design:type", Number)
], EnquiryDetailDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York' }),
    __metadata("design:type", String)
], EnquiryDetailDto.prototype, "location", void 0);
class PropertyDetailDto {
}
exports.PropertyDetailDto = PropertyDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'property-class' }),
    __metadata("design:type", String)
], PropertyDetailDto.prototype, "className", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345' }),
    __metadata("design:type", String)
], PropertyDetailDto.prototype, "listingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Luxury Apartment' }),
    __metadata("design:type", String)
], PropertyDetailDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York, NY' }),
    __metadata("design:type", String)
], PropertyDetailDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '500,000 USD' }),
    __metadata("design:type", String)
], PropertyDetailDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['image1.jpg', 'image2.jpg'] }),
    __metadata("design:type", Array)
], PropertyDetailDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [{ text: 'New', variant: property_enum_1.TagVariant.ALERT, iconUrl: 'icon1.png' }],
    }),
    __metadata("design:type", Array)
], PropertyDetailDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [{ text: 'Swimming Pool', iconLocation: 'icon-location.png' }],
    }),
    __metadata("design:type", Array)
], PropertyDetailDto.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PropertyDetailDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CrmDetailsDto }),
    __metadata("design:type", CrmDetailsDto)
], PropertyDetailDto.prototype, "crmDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'This is a detailed description of the property.' }),
    __metadata("design:type", String)
], PropertyDetailDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://video-url.com' }),
    __metadata("design:type", String)
], PropertyDetailDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EnquiryDetailDto }),
    __metadata("design:type", EnquiryDetailDto)
], PropertyDetailDto.prototype, "enquiryDetail", void 0);
//# sourceMappingURL=property-detail.dto.js.map