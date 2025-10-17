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
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const video_enum_1 = require("./enums/video.enum");
const video_entity_1 = require("./entities/video.entity");
let VideoService = class VideoService {
    constructor(videoModel) {
        this.videoModel = videoModel;
    }
    async create(userId, createVideoDto) {
        const video = new this.videoModel({
            userId,
            ...createVideoDto,
            status: video_enum_1.VideoStatus.PENDING,
            earnings: 0,
        });
        return video.save();
    }
    async findAllByUser(userId) {
        return this.videoModel.find({ userId }).exec();
    }
    async findOne(id, userId) {
        const video = await this.videoModel.findOne({ _id: id, userId }).exec();
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        return video;
    }
    async updateStatus(id, updateVideoStatusDto) {
        const updateData = {
            status: updateVideoStatusDto.status,
        };
        if (updateVideoStatusDto.status === video_enum_1.VideoStatus.APPROVED) {
            updateData.approvedAt = new Date();
            updateData.rejectedAt = null;
            updateData.rejectionReason = null;
        }
        else if (updateVideoStatusDto.status === video_enum_1.VideoStatus.REJECTED) {
            updateData.rejectedAt = new Date();
            updateData.approvedAt = null;
            updateData.rejectionReason = updateVideoStatusDto.rejectionReason;
        }
        const video = await this.videoModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        return video;
    }
    async calculateEarnings(userId) {
        const result = await this.videoModel.aggregate([
            {
                $match: {
                    userId,
                    status: video_enum_1.VideoStatus.APPROVED,
                },
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: '$earnings' },
                },
            },
        ]);
        return result.length > 0 ? result[0].totalEarnings : 0;
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_entity_1.Video.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VideoService);
//# sourceMappingURL=video.service.js.map