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
var AmenityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmenityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const amenity_entity_1 = require("./entities/amenity.entity");
let AmenityService = AmenityService_1 = class AmenityService {
    constructor(amenityModel) {
        this.amenityModel = amenityModel;
        this.logger = new common_1.Logger(AmenityService_1.name);
    }
    async create(createAmenityDto) {
        this.logger.log(`Creating amenity: ${createAmenityDto.name}`);
        const existingAmenity = await this.amenityModel.findOne({
            name: createAmenityDto.name,
        });
        if (existingAmenity) {
            throw new common_1.ConflictException(`Amenity with name '${createAmenityDto.name}' already exists`);
        }
        const createdAmenity = new this.amenityModel(createAmenityDto);
        return await createdAmenity.save();
    }
    async update(id, updateAmenityDto) {
        this.logger.log(`Updating amenity with ID: ${id}`);
        const updatedAmenity = await this.amenityModel
            .findByIdAndUpdate(id, updateAmenityDto, {
            new: true,
            runValidators: true,
        })
            .exec();
        if (!updatedAmenity) {
            throw new common_1.NotFoundException(`Amenity with ID '${id}' not found`);
        }
        return updatedAmenity;
    }
    async findAll(pageSize, pageNumber, sortBy = 'name', sortOrder = 'asc', searchQuery) {
        const size = parseInt(pageSize, 10) || 10;
        const page = parseInt(pageNumber, 10) || 1;
        const skip = (page - 1) * size;
        const query = {};
        if (searchQuery) {
            query.$or = [{ name: { $regex: searchQuery, $options: 'i' } }];
        }
        this.logger.log(`Fetching amenities - Page: ${page}, Size: ${size}, Search: ${searchQuery || 'none'}`);
        const totalAmenities = await this.amenityModel.countDocuments(query);
        const totalPages = Math.ceil(totalAmenities / size);
        const amenities = await this.amenityModel
            .find(query)
            .skip(skip)
            .limit(size)
            .sort({ [sortBy]: sortOrder })
            .exec();
        return {
            amenities,
            totalPages,
            totalAmenities,
            pageSize: size,
            pageNumber: page,
        };
    }
    async findOne(id) {
        this.logger.log(`Fetching amenity with ID: ${id}`);
        const amenity = await this.amenityModel.findById(id).exec();
        if (!amenity) {
            throw new common_1.NotFoundException(`Amenity with ID '${id}' not found`);
        }
        return amenity;
    }
    async remove(id) {
        this.logger.log(`Deleting amenity with ID: ${id}`);
        const result = await this.amenityModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Amenity with ID '${id}' not found`);
        }
        return result;
    }
    async AmenityList() {
        this.logger.log('Fetching amenity list');
        const amenities = await this.amenityModel.find().exec();
        return amenities.map((amenity) => ({
            value: amenity._id.toString(),
            label: amenity.name,
        }));
    }
};
exports.AmenityService = AmenityService;
exports.AmenityService = AmenityService = AmenityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(amenity_entity_1.Amenity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AmenityService);
//# sourceMappingURL=amenity.service.js.map