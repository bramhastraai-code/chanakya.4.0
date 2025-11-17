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
exports.ShortVideoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const short_video_service_1 = require("./short-video.service");
const short_video_entity_1 = require("./entities/short-video.entity");
const create_short_video_dto_1 = require("./dto/create-short-video.dto");
const update_short_video_dto_1 = require("./dto/update-short-video.dto");
let ShortVideoController = class ShortVideoController {
    constructor(shortVideoService) {
        this.shortVideoService = shortVideoService;
    }
    async create(createShortVideoDto) {
        try {
            const data = await this.shortVideoService.create(createShortVideoDto);
            console.log(data);
            return { data, message: 'Short video uploaded successfully' };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async update(id, updateShortVideoDto) {
        try {
            const data = await this.shortVideoService.update(id, updateShortVideoDto);
            if (!data) {
                throw new common_1.NotFoundException('Short video not found');
            }
            return { data, message: 'Short video updated successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while updating the short video.');
        }
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery) {
        try {
            const data = await this.shortVideoService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery);
            if (!data?.shortVideos || data.shortVideos.length === 0) {
                throw new common_1.NotFoundException('No short videos found');
            }
            return { data, message: 'Videos retrieved successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving the short videos.');
        }
    }
    async findOne(id) {
        try {
            const video = await this.shortVideoService.findOne(id);
            if (!video) {
                throw new common_1.NotFoundException('Short video not found');
            }
            return { data: video, message: 'Video retrieved successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async remove(id) {
        try {
            const result = await this.shortVideoService.remove(id);
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Short video not found');
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getVideoList(page = 1, limit = 10) {
        const data = await this.shortVideoService.videoList(page, limit);
        return { data, message: 'Videos retrieved successfully' };
    }
    async incrementStat(id, key) {
        if (!['views', 'likes', 'shares'].includes(key)) {
            throw new common_1.BadRequestException('Invalid stat key');
        }
        const data = await this.shortVideoService.incrementStat(id, key);
        return { data, message: 'Stat incremented successfully' };
    }
};
exports.ShortVideoController = ShortVideoController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a new short video' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Short video uploaded successfully',
        type: short_video_entity_1.ShortVideo,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_short_video_dto_1.CreateShortVideoDto]),
    __metadata("design:returntype", Promise)
], ShortVideoController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing short video' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Short video updated successfully',
        type: short_video_entity_1.ShortVideo,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Short video not found',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_short_video_dto_1.UpdateShortVideoDto]),
    __metadata("design:returntype", Promise)
], ShortVideoController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all short videos with pagination, sorting, and search',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        type: Number,
        required: true,
        description: 'Number of short videos per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageNumber',
        type: Number,
        required: true,
        description: 'Page number to retrieve',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        type: String,
        required: false,
        enum: ['title', 'createdAt', 'updatedAt'],
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        type: String,
        required: false,
        enum: ['asc', 'desc'],
        description: 'Sort order',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        type: String,
        required: false,
        description: 'Search term for filtering short videos',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of short videos retrieved successfully',
        type: [short_video_entity_1.ShortVideo],
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'No short videos found',
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ShortVideoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('short/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a single short video by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The short video details',
        type: short_video_entity_1.ShortVideo,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Short video not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShortVideoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)('short/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a short video by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Short video deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Short video not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShortVideoController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('web/video-list'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a list of short videos with pagination',
        description: 'Fetches a list of short videos with pagination support.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of short videos fetched successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ShortVideoController.prototype, "getVideoList", null);
__decorate([
    (0, common_1.Patch)('web/:id/increment-stat'),
    (0, swagger_1.ApiOperation)({
        summary: 'Increment stat for views, likes, or shares',
        description: 'Increment the count of views, likes, or shares for a short video.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The stat was successfully incremented',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid stat key',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Short video not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ShortVideoController.prototype, "incrementStat", null);
exports.ShortVideoController = ShortVideoController = __decorate([
    (0, swagger_1.ApiTags)('short-videos'),
    (0, common_1.Controller)('short-videos'),
    __metadata("design:paramtypes", [short_video_service_1.ShortVideoService])
], ShortVideoController);
//# sourceMappingURL=short-video.controller.js.map