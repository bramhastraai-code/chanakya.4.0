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
exports.CreateBrokerInquiryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBrokerInquiryDto {
}
exports.CreateBrokerInquiryDto = CreateBrokerInquiryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact number of the broker' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBrokerInquiryDto.prototype, "contactNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Name of the broker' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBrokerInquiryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address of the broker' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBrokerInquiryDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City of the broker' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBrokerInquiryDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Title of the inquiry' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBrokerInquiryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of inquiry',
        enum: ['common', 'groupBuy', 'agentSelection', 'quickBuy', 'siteVisit'],
    }),
    (0, class_validator_1.IsEnum)(['common', 'groupBuy', 'agentSelection', 'quickBuy', 'siteVisit']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBrokerInquiryDto.prototype, "inquiryType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Project ID related to the inquiry' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBrokerInquiryDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Property ID related to the inquiry' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBrokerInquiryDto.prototype, "propertyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message content of the inquiry' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBrokerInquiryDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'About the inquiry' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBrokerInquiryDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date for site visit',
        type: String,
        format: 'date-time',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateBrokerInquiryDto.prototype, "siteVisitDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Time for site visit' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBrokerInquiryDto.prototype, "siteVisitTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the inquiry',
        enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'PENDING',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBrokerInquiryDto.prototype, "status", void 0);
//# sourceMappingURL=create-agent-inquiry.dto.js.map