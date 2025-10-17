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
exports.UpdateVideoStatusDto = void 0;
const class_validator_1 = require("class-validator");
const video_enum_1 = require("../enums/video.enum");
const swagger_1 = require("@nestjs/swagger");
class UpdateVideoStatusDto {
}
exports.UpdateVideoStatusDto = UpdateVideoStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The new status of the video',
        enum: video_enum_1.VideoStatus,
        example: video_enum_1.VideoStatus.APPROVED,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(video_enum_1.VideoStatus),
    __metadata("design:type", String)
], UpdateVideoStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for rejection if status is REJECTED',
        example: 'Video contains prohibited content',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVideoStatusDto.prototype, "rejectionReason", void 0);
//# sourceMappingURL=update-video-status.dto.js.map