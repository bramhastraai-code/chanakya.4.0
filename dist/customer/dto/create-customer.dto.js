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
exports.CreateCustomerDto = void 0;
const class_validator_1 = require("class-validator");
const usertype_enum_1 = require("../enum/usertype.enum");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateCustomerDto {
    constructor() {
        this.status = usertype_enum_1.UserStatus.ACTIVE;
    }
}
exports.CreateCustomerDto = CreateCustomerDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Full name of the customer',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL to user profile image',
        example: 'https://example.com/profile.jpg',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "userImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Status of the contact',
        enum: usertype_enum_1.LeadStatus,
        example: 'qualified',
        default: 'qualified',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(usertype_enum_1.LeadStatus),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "contactStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Firebase Cloud Messaging token for push notifications',
        example: 'fcm_token_example',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "fcmToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address of the customer',
        example: 'john.doe@example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of user',
        enum: usertype_enum_1.UserType,
        example: usertype_enum_1.UserType.USER,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(usertype_enum_1.UserType),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "userType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number of the customer',
        example: '+1234567890',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the assigned agent',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "assignAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of builder IDs associated with the customer',
        type: [String],
        example: ['60d21b4667d0d8992e610c85', '60d21b4967d0d8992e610c86'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCustomerDto.prototype, "builders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of project IDs the customer has applied to',
        type: [String],
        example: ['project1', 'project2'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCustomerDto.prototype, "projectsApplied", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Average response time',
        example: '1 day',
        default: '1 day',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "responseTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Areas where services are provided',
        type: [String],
        example: ['New York', 'Boston'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateCustomerDto.prototype, "serviceAreas", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Verification status of the customer',
        enum: usertype_enum_1.VerificationStatus,
        example: usertype_enum_1.VerificationStatus.PENDING,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(usertype_enum_1.VerificationStatus),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "verificationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of verification document URLs',
        type: [String],
        example: ['https://example.com/doc1.pdf', 'https://example.com/doc2.pdf'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCustomerDto.prototype, "verificationDocuments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'License number if applicable',
        example: 'LIC123456',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'License expiry date in ISO format',
        example: '2025-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Years of professional experience',
        example: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCustomerDto.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of the agency if user is an agency',
        example: 'Prime Real Estate',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "agencyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Agency license number',
        example: 'AGENCY123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "agencyLicense", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Year the agency was founded',
        example: 2010,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCustomerDto.prototype, "agencyFoundedYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Size of the team',
        example: 10,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCustomerDto.prototype, "teamSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Average rating',
        example: 4.5,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCustomerDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of reviews received',
        example: 25,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCustomerDto.prototype, "reviewCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of deals closed',
        example: 50,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCustomerDto.prototype, "closedDeals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Social media links',
        example: {
            facebook: 'https://facebook.com/johndoe',
            linkedin: 'https://linkedin.com/in/johndoe',
            instagram: 'https://instagram.com/johndoe',
        },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCustomerDto.prototype, "socialMedia", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Latitude coordinate',
        example: '40.7128',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Longitude coordinate',
        example: '-74.0060',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Full street address',
        example: '123 Main St',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'City name',
        example: 'New York',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'State or province',
        example: 'NY',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Country name',
        example: 'United States',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Postal or zip code',
        example: '10001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "pinCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Status of the user',
        enum: usertype_enum_1.UserStatus,
        example: usertype_enum_1.UserStatus.ACTIVE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(usertype_enum_1.UserStatus),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "status", void 0);
//# sourceMappingURL=create-customer.dto.js.map