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
exports.IncrementStatDto = exports.CreateShortVideoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const status_enum_1 = require("../../common/enum/status.enum");
class CreateShortVideoDto {
}
exports.CreateShortVideoDto = CreateShortVideoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL of the video',
        example: 'https://example.com/video.mp4',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateShortVideoDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Thumbnail URL of the video',
        example: 'https://example.com/thumbnail.jpg',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateShortVideoDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the video',
        example: 'Amazing Property Tour',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShortVideoDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the video',
        example: 'A quick overview of the property and its features.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShortVideoDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of views',
        example: 1000,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], CreateShortVideoDto.prototype, "views", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of likes',
        example: 500,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], CreateShortVideoDto.prototype, "likes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of shares',
        example: 200,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], CreateShortVideoDto.prototype, "shares", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority of the short video',
        example: 1,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], CreateShortVideoDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the video',
        enum: status_enum_1.Status,
        example: status_enum_1.Status.ACTIVE,
        default: status_enum_1.Status.IN_ACTIVE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(status_enum_1.Status),
    __metadata("design:type", String)
], CreateShortVideoDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the associated project',
        example: '64f5b5a5f0e4d9a4e8c3d6e8',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateShortVideoDto.prototype, "associatedProject", void 0);
class IncrementStatDto {
}
exports.IncrementStatDto = IncrementStatDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['view', 'like', 'share'], {
        message: 'key must be one of the following: view, like, share',
    }),
    __metadata("design:type", String)
], IncrementStatDto.prototype, "key", void 0);
//# sourceMappingURL=create-short-video.dto.js.map