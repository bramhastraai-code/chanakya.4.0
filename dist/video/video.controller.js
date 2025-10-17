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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const create_video_dto_1 = require("./dto/create-video.dto");
const update_video_status_dto_1 = require("./dto/update-video-status.dto");
const video_response_dto_1 = require("./dto/video-response.dto");
const swagger_1 = require("@nestjs/swagger");
const video_service_1 = require("./video.service");
const passport_1 = require("@nestjs/passport");
let VideoController = class VideoController {
    constructor(videosService) {
        this.videosService = videosService;
    }
    async create(createVideoDto, req) {
        const id = req.user._id;
        const video = await this.videosService.create(id, createVideoDto);
        const data = this.mapToDto(video);
        return { data, message: 'created successfully' };
    }
    async findAllByUser(req) {
        const id = req.user._id;
        const videos = await this.videosService.findAllByUser(id);
        return { data: videos.map(this.mapToDto), message: 'retrieve the message' };
    }
    async getEarnings(req) {
        const id = req.user._id;
        const earnings = await this.videosService.calculateEarnings(id);
        return { data: { earnings }, message: 'retrieved Successfully.' };
    }
    async findOne(req, id) {
        const userId = req.user._id;
        const video = await this.videosService.findOne(id, userId);
        const data = this.mapToDto(video);
        return { data, message: 'retrieved successfully' };
    }
    async updateStatus(id, updateVideoStatusDto) {
        const video = await this.videosService.updateStatus(id, updateVideoStatusDto);
        const data = this.mapToDto(video);
        return { data, message: 'updated successfully' };
    }
    mapToDto(video) {
        const dto = new video_response_dto_1.VideoResponseDto();
        Object.assign(dto, video.toJSON());
        dto.id = video._id.toString();
        return dto;
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new video entry' }),
    (0, swagger_1.ApiBody)({ type: create_video_dto_1.CreateVideoDto }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Video created successfully',
        type: video_response_dto_1.VideoResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid input data' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_video_dto_1.CreateVideoDto, Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Get all videos for current user' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Videos retrieved successfully',
        type: [video_response_dto_1.VideoResponseDto],
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.Get)('earnings'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Get total earnings for current user' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Earnings calculated successfully',
        schema: {
            type: 'object',
            properties: {
                earnings: { type: 'number', example: 25000 },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getEarnings", null);
__decorate([
    (0, common_1.Get)('video/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific video' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Video ID',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Video retrieved successfully',
        type: video_response_dto_1.VideoResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Video not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Update video status (Admin only)' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Video ID',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, swagger_1.ApiBody)({ type: update_video_status_dto_1.UpdateVideoStatusDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Video status updated successfully',
        type: video_response_dto_1.VideoResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Video not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Admin access required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_video_status_dto_1.UpdateVideoStatusDto]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "updateStatus", null);
exports.VideoController = VideoController = __decorate([
    (0, swagger_1.ApiTags)('Videos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('videos'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], VideoController);
//# sourceMappingURL=video.controller.js.map