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
    (0, swagger_1.ApiProperty)({
        description: 'Email of the person making the inquiry',
        required: false,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the person making the inquiry',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number of the customer',
        required: false,
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Company name',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "companyname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the inquiry',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of the inquiry',
        enum: [
            'common',
            'groupBuy',
            'agentSelection',
            'quickBuy',
            'siteVisit',
            'loan',
            'advisory',
        ],
        default: 'common',
        required: false,
    }),
    (0, class_validator_1.IsEnum)([
        'common',
        'groupBuy',
        'agentSelection',
        'quickBuy',
        'siteVisit',
        'loan',
        'advisory',
    ]),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "inquiryType", void 0);
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
    (0, swagger_1.ApiProperty)({
        description: 'Detailed message of the inquiry',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'About what the inquiry is regarding',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of the site visit',
        required: false,
        type: String,
        format: 'date-time',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value) : value)),
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
        description: 'Status of the inquiry',
        enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'PENDING',
        required: false,
    }),
    (0, class_validator_1.IsEnum)(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInquiryDto.prototype, "status", void 0);
//# sourceMappingURL=create-inquiry.dto.js.map