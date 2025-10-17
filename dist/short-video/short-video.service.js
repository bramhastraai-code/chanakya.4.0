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
exports.ShortVideoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const short_video_entity_1 = require("./entities/short-video.entity");
let ShortVideoService = class ShortVideoService {
    constructor(shortVideoModel) {
        this.shortVideoModel = shortVideoModel;
    }
    async create(createShortVideoDto) {
        try {
            const existingVideo = await this.shortVideoModel.findOne({
                videoUrl: createShortVideoDto.videoUrl,
            });
            if (existingVideo) {
                throw new common_1.ConflictException('Video with the same URL already exists.');
            }
            const createdVideo = new this.shortVideoModel(createShortVideoDto);
            return await createdVideo.save();
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateShortVideoDto) {
        try {
            const updatedVideo = await this.shortVideoModel
                .findByIdAndUpdate(id, updateShortVideoDto, {
                new: true,
                runValidators: true,
            })
                .exec();
            if (!updatedVideo) {
                throw new common_1.NotFoundException('Short video not found.');
            }
            return updatedVideo;
        }
        catch (error) {
            throw error;
        }
    }
    async findAll(pageSize, pageNumber, sortBy = 'priority', sortOrder = 'asc', searchQuery) {
        try {
            const size = parseInt(pageSize, 10) || 10;
            const page = parseInt(pageNumber, 10) || 1;
            const skip = (page - 1) * size;
            const query = {};
            if (searchQuery) {
                query.$or = [
                    { title: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                ];
            }
            const totalVideos = await this.shortVideoModel.countDocuments(query);
            const totalPages = Math.ceil(totalVideos / size);
            const shortVideos = await this.shortVideoModel
                .find(query)
                .skip(skip)
                .limit(size)
                .sort({ [sortBy]: sortOrder })
                .exec();
            return {
                shortVideos,
                totalPages,
                totalVideos,
                pageSize: size,
                pageNumber: page,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const shortVideo = await this.shortVideoModel
                .findById({ _id: id })
                .populate('associatedProject')
                .exec();
            if (!shortVideo) {
                throw new common_1.NotFoundException('Short video not found.');
            }
            return shortVideo;
        }
        catch (error) {
            throw error;
        }
    }
    async remove(id) {
        try {
            const result = await this.shortVideoModel.deleteOne({ _id: id }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Short video not found.');
            }
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while deleting the short video.');
        }
    }
    async videoList(page, limit) {
        const skip = (page - 1) * limit;
        const total = await this.shortVideoModel.countDocuments();
        const data = await this.shortVideoModel
            .find()
            .skip(skip)
            .limit(limit)
            .populate({
            path: 'associatedProject',
            select: 'thumbnail,projectName priceAverage priceMin priceMax address city state',
            populate: {
                path: 'builder',
                select: 'name logo contactDetails',
            },
        })
            .exec();
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async incrementStat(id, key) {
        const validKeys = ['likes', 'shares', 'views'];
        if (!validKeys.includes(key)) {
            throw new common_1.BadRequestException(`Invalid stat key: "${key}"`);
        }
        const shortVideo = await this.shortVideoModel.findById(id);
        if (!shortVideo) {
            throw new common_1.NotFoundException(`Short video with ID "${id}" not found.`);
        }
        shortVideo[key] += 1;
        return shortVideo.save();
    }
};
exports.ShortVideoService = ShortVideoService;
exports.ShortVideoService = ShortVideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(short_video_entity_1.ShortVideo.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ShortVideoService);
//# sourceMappingURL=short-video.service.js.map