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
exports.BannerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_banner_dto_1 = require("./dto/create-banner.dto");
const banner_entity_1 = require("./entities/banner.entity");
const update_banner_dto_1 = require("./dto/update-banner.dto");
const banner_service_1 = require("./banner.service");
let BannerController = class BannerController {
    constructor(bannerService) {
        this.bannerService = bannerService;
    }
    async create(createBannerDto) {
        try {
            const data = await this.bannerService.create(createBannerDto);
            return { data, message: 'created sucessfully banner ' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while creating the  banner.');
        }
    }
    async findAll(pageSize = '10', pageNumber = '1', sortBy = 'createdAt', sortOrder = 'asc', searchQuery, isActive) {
        try {
            const data = await this.bannerService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery, isActive);
            if (!data.banners || data.banners.length === 0) {
                throw new common_1.NotFoundException('No  banners found');
            }
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving  banners.');
        }
    }
    async findOne(id) {
        try {
            const banner = await this.bannerService.findOne(id);
            if (!banner) {
                throw new common_1.NotFoundException(' banner not found');
            }
            return { data: banner, message: 'retrieve successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving the  banner.');
        }
    }
    async update(id, updateBannerDto) {
        try {
            const banner = await this.bannerService.update(id, updateBannerDto);
            if (!banner) {
                throw new common_1.NotFoundException(' banner not found');
            }
            return banner;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while updating the  banner.');
        }
    }
    async remove(id) {
        try {
            const result = await this.bannerService.remove(id);
            if (!result) {
                throw new common_1.NotFoundException(' banner not found');
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while deleting the  banner.');
        }
    }
    async getActiveBanners() {
        return this.bannerService.getActiveBanners();
    }
};
exports.BannerController = BannerController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new  banner' }),
    (0, swagger_1.ApiBody)({ type: create_banner_dto_1.CreateBannerDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: ' banner created successfully',
        type: banner_entity_1.Banner,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_banner_dto_1.CreateBannerDto]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all  banners with optional search, filter, and sort',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        type: String,
        required: false,
        enum: ['createdAt', 'updatedAt'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        type: String,
        required: false,
        enum: ['asc', 'desc'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        type: String,
        required: false,
        description: 'Search term for filtering banners by title or description',
    }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', type: Boolean, required: false }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of  banners',
        type: banner_entity_1.Banner,
        isArray: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No banners found',
    }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __param(5, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('banner/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve an  banner by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: ' banner retrieved successfully',
        type: banner_entity_1.Banner,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Banner not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('banner/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an  banner by ID' }),
    (0, swagger_1.ApiBody)({ type: update_banner_dto_1.UpdateBannerDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: ' banner updated successfully',
        type: banner_entity_1.Banner,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Banner not found',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_banner_dto_1.UpdateBannerDto]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('banner/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an  banner by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: ' banner deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Banner not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getActiveBanners", null);
exports.BannerController = BannerController = __decorate([
    (0, swagger_1.ApiTags)(' Banners'),
    (0, common_1.Controller)('banners'),
    __metadata("design:paramtypes", [banner_service_1.BannerService])
], BannerController);
//# sourceMappingURL=banner.controller.js.map