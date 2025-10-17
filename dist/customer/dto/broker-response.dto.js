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
exports.BrokerResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const usertype_enum_1 = require("../enum/usertype.enum");
const class_validator_1 = require("class-validator");
class BrokerResponseDto {
}
exports.BrokerResponseDto = BrokerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BrokerResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User name' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BrokerResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User profile image URL' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BrokerResponseDto.prototype, "userImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BrokerResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average response time', default: '1 day' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BrokerResponseDto.prototype, "responseTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Service areas', type: [String], default: [] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BrokerResponseDto.prototype, "serviceAreas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: Object.values(usertype_enum_1.VerificationStatus),
        description: 'Verification status',
        default: usertype_enum_1.VerificationStatus.PENDING,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BrokerResponseDto.prototype, "verificationStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Verification documents',
        type: [String],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BrokerResponseDto.prototype, "verificationDocuments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'License number', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BrokerResponseDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'License expiry date', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], BrokerResponseDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Years of experience', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BrokerResponseDto.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agency name', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BrokerResponseDto.prototype, "agencyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agency license', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BrokerResponseDto.prototype, "agencyLicense", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Year agency was founded', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BrokerResponseDto.prototype, "agencyFoundedYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Team size', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BrokerResponseDto.prototype, "teamSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average rating (0-5)', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BrokerResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of reviews received', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BrokerResponseDto.prototype, "reviewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of closed deals', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BrokerResponseDto.prototype, "closedDeals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Calculated performance score (higher is better)',
        example: 4.25,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BrokerResponseDto.prototype, "performanceScore", void 0);
//# sourceMappingURL=broker-response.dto.js.map