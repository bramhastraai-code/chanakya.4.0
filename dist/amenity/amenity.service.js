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
exports.AmenityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const amenity_entity_1 = require("./entities/amenity.entity");
let AmenityService = class AmenityService {
    constructor(amenityModel) {
        this.amenityModel = amenityModel;
    }
    async create(createAmenityDto) {
        try {
            console.count('issie1');
            const checkAmenity = await this.amenityModel.findOne({
                name: createAmenityDto.name,
            });
            if (checkAmenity) {
                throw new common_1.ConflictException('amenity is already available');
            }
            console.log('amenity service create ', createAmenityDto);
            const createdAmenity = new this.amenityModel(createAmenityDto);
            return await createdAmenity.save();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while creating the amenity.');
        }
    }
    async update(id, updateAmenityDto) {
        try {
            const updatedAmenity = await this.amenityModel
                .findByIdAndUpdate(id, updateAmenityDto, {
                new: true,
                runValidators: true,
            })
                .exec();
            if (!updatedAmenity) {
                throw new common_1.NotFoundException('Amenity not found');
            }
            return updatedAmenity;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while updating the amenity.');
        }
    }
    async findAll(pageSize, pageNumber, sortBy = 'name', sortOrder = 'asc', searchQuery) {
        try {
            const size = parseInt(pageSize, 10) || 10;
            const page = parseInt(pageNumber, 10) || 1;
            const skip = (page - 1) * size;
            const query = {};
            if (searchQuery) {
                query.$or = [{ name: { $regex: searchQuery, $options: 'i' } }];
            }
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
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving amenities.');
        }
    }
    async findOne(id) {
        try {
            const amenity = await this.amenityModel.findById(id).exec();
            if (!amenity) {
                throw new common_1.NotFoundException('Amenity not found');
            }
            return amenity;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving the amenity.');
        }
    }
    async remove(id) {
        try {
            const result = await this.amenityModel.deleteOne({ _id: id }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Amenity not found');
            }
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while deleting the amenity.');
        }
    }
    async AmenityList() {
        const amenities = await this.amenityModel.find().exec();
        const data = amenities.map((amenity) => ({
            value: amenity._id,
            label: amenity.name,
        }));
        return data;
    }
};
exports.AmenityService = AmenityService;
exports.AmenityService = AmenityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(amenity_entity_1.Amenity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AmenityService);
//# sourceMappingURL=amenity.service.js.map