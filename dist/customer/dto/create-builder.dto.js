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
exports.UpdateBuilderDto = exports.CreateBuilderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const usertype_enum_1 = require("../enum/usertype.enum");
class CreateBuilderDto {
    constructor() {
        this.userType = usertype_enum_1.UserType.BUILDER;
        this.responseTime = '1 day';
        this.serviceAreas = [];
        this.verificationStatus = usertype_enum_1.VerificationStatus.PENDING;
        this.status = usertype_enum_1.UserStatus.ACTIVE;
    }
}
exports.CreateBuilderDto = CreateBuilderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "userImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "fcmToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: usertype_enum_1.UserType, default: usertype_enum_1.UserType.BUILDER }),
    (0, class_validator_1.IsEnum)(usertype_enum_1.UserType),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "userType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: '1 day' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "responseTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false, default: [] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBuilderDto.prototype, "serviceAreas", void 0);
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
], CreateBuilderDto.prototype, "builders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: usertype_enum_1.VerificationStatus,
        default: usertype_enum_1.VerificationStatus.PENDING,
    }),
    (0, class_validator_1.IsEnum)(usertype_enum_1.VerificationStatus),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "verificationStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBuilderDto.prototype, "verificationDocuments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: usertype_enum_1.UserStatus, default: usertype_enum_1.UserStatus.ACTIVE }),
    (0, class_validator_1.IsEnum)(usertype_enum_1.UserStatus),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuilderDto.prototype, "pinCode", void 0);
class UpdateBuilderDto extends (0, swagger_1.PartialType)(CreateBuilderDto) {
}
exports.UpdateBuilderDto = UpdateBuilderDto;
//# sourceMappingURL=create-builder.dto.js.map