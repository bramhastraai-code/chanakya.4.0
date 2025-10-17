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
exports.UserBehaviorResponseDto = exports.TrackUserBehaviorDto = exports.DeviceInfoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_behavior_entity_1 = require("../entities/user-behavior.entity");
class DeviceInfoDto {
}
exports.DeviceInfoDto = DeviceInfoDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Operating system of the user device',
        example: 'Windows 10',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeviceInfoDto.prototype, "os", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Browser used by the user',
        example: 'Chrome 115',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeviceInfoDto.prototype, "browser", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of device',
        example: 'desktop',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeviceInfoDto.prototype, "deviceType", void 0);
class TrackUserBehaviorDto {
}
exports.TrackUserBehaviorDto = TrackUserBehaviorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the user',
        example: '507f1f77bcf86cd799439011',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of user (optional)',
        example: 'new',
        enum: ['new', 'old'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['new', 'old']),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "userType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Session ID for tracking user journey',
        example: 'session_abc123',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of user behavior event',
        enum: user_behavior_entity_1.UserBehaviorType,
        example: user_behavior_entity_1.UserBehaviorType.PAGE_VIEW,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(user_behavior_entity_1.UserBehaviorType),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Firebase Cloud Messaging token for push notifications',
        example: 'sample_fcm_token',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "fcmToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL of the page where the event occurred',
        example: 'https://example.com/products',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "pageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Title of the page',
        example: 'Product Listing Page',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "pageTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Section of the website/app where event occurred',
        example: 'product-listing',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "section", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Referrer URL',
        example: 'https://google.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "referrer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IP address of the user',
        example: '192.168.1.1',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device information',
        type: DeviceInfoDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", DeviceInfoDto)
], TrackUserBehaviorDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Call-to-action element ID',
        example: 'cta-button-1',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "ctaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of CTA element',
        example: 'button',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "ctaType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Text content of the CTA element',
        example: 'Buy Now',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackUserBehaviorDto.prototype, "ctaText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata about the event',
        example: { productId: '123', price: 99.99 },
        type: Object,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TrackUserBehaviorDto.prototype, "metadata", void 0);
class UserBehaviorResponseDto {
}
exports.UserBehaviorResponseDto = UserBehaviorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the behavior record',
        example: '507f1f77bcf86cd799439011',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID associated with the event',
        example: '507f1f77bcf86cd799439011',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Session ID',
        example: 'session_abc123',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: user_behavior_entity_1.UserBehaviorType,
        example: user_behavior_entity_1.UserBehaviorType.PAGE_VIEW,
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/products',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "pageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Product Listing Page',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "pageTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'product-listing',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "section", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://google.com',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "referrer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '192.168.1.1',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: DeviceInfoDto,
    }),
    __metadata("design:type", DeviceInfoDto)
], UserBehaviorResponseDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'cta-button-1',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "ctaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'button',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "ctaType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Buy Now',
    }),
    __metadata("design:type", String)
], UserBehaviorResponseDto.prototype, "ctaText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { productId: '123', price: 99.99 },
        type: Object,
    }),
    __metadata("design:type", Object)
], UserBehaviorResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Date,
        example: '2023-08-15T10:00:00.000Z',
    }),
    __metadata("design:type", Date)
], UserBehaviorResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Date,
        example: '2023-08-15T10:00:00.000Z',
    }),
    __metadata("design:type", Date)
], UserBehaviorResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=create-user-behavior.dto.js.map