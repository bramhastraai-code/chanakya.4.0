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
exports.CreateVideoDto = void 0;
const class_validator_1 = require("class-validator");
const video_enum_1 = require("../enums/video.enum");
const swagger_1 = require("@nestjs/swagger");
class CreateVideoDto {
}
exports.CreateVideoDto = CreateVideoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the video',
        example: 'My Awesome Video',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the video',
        example: 'This video demonstrates amazing features',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of video source',
        enum: video_enum_1.VideoSourceType,
        enumName: 'VideoSourceType',
        example: video_enum_1.VideoSourceType.S3,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(video_enum_1.VideoSourceType),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'S3 key for the video file (required if sourceType is S3)',
        example: 'uploads/user123/123456789-video.mp4',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.sourceType === video_enum_1.VideoSourceType.S3),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "s3Key", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'YouTube URL (required if sourceType is YOUTUBE)',
        example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.sourceType === video_enum_1.VideoSourceType.YOUTUBE),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "youtubeUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the associated project',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "projectId", void 0);
//# sourceMappingURL=create-video.dto.js.map