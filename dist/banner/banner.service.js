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
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const banner_entity_1 = require("./entities/banner.entity");
let BannerService = class BannerService {
    constructor(bannerModel) {
        this.bannerModel = bannerModel;
    }
    async create(createBannerDto) {
        try {
            const createdBanner = new this.bannerModel(createBannerDto);
            return createdBanner.save();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while creating the  banner.');
        }
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery, isActive) {
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
            if (isActive !== undefined) {
                query.isActive = isActive;
            }
            const totalBanners = await this.bannerModel.countDocuments(query);
            const totalPages = Math.ceil(totalBanners / size);
            const banners = await this.bannerModel
                .find(query)
                .skip(skip)
                .limit(size)
                .sort({ [sortBy]: sortOrder });
            return {
                banners,
                totalBanners,
                totalPages,
                pageSize: size,
                pageNumber: page,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving  banners.');
        }
    }
    async findOne(id) {
        try {
            const banner = await this.bannerModel.findById(id).exec();
            if (!banner) {
                throw new common_1.NotFoundException(' banner not found');
            }
            return banner;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving the  banner.');
        }
    }
    async update(id, updateBannerDto) {
        try {
            const updatedBanner = await this.bannerModel
                .findByIdAndUpdate(id, { $set: updateBannerDto }, { new: true })
                .exec();
            if (!updatedBanner) {
                throw new common_1.NotFoundException(' banner not found');
            }
            return updatedBanner;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while updating the  banner.');
        }
    }
    async remove(id) {
        try {
            const result = await this.bannerModel.findByIdAndDelete(id).exec();
            if (!result) {
                throw new common_1.NotFoundException(' banner not found');
            }
            return true;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while deleting the  banner.');
        }
    }
    async getActiveBanners() {
        const currentDate = new Date();
        return this.bannerModel
            .find({
            isActive: true,
            $or: [
                { startDate: { $lte: currentDate }, endDate: { $gte: currentDate } },
                { startDate: { $exists: false }, endDate: { $exists: false } },
            ],
        })
            .exec();
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(banner_entity_1.Banner.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BannerService);
//# sourceMappingURL=banner.service.js.map