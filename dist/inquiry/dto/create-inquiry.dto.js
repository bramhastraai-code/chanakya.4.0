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
exports.CreateInquiryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateInquiryDto {
}
exports.CreateInquiryDto = CreateInquiryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID who made the inquiry' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateInquiryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact number of the customer',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "contactNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'title of the customer',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of the inquiry',
        enum: ['common', 'groupBuy', 'agentSelection', 'quickBuy', 'siteVisit'],
        default: 'common',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "inquiryType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of the site visit',
        required: false,
        type: String,
        format: 'date-time',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateInquiryDto.prototype, "siteVisitDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time of the site visit',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "siteVisitTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project ID related to the inquiry',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? null : value)),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property ID related to the inquiry',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? null : value)),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "propertyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message related to the inquiry' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'about related to the inquiry' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the inquiry',
        enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'PENDING',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "status", void 0);
//# sourceMappingURL=create-inquiry.dto.js.map