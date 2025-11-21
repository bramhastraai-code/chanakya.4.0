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
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const property_entity_1 = require("./entities/property.entity");
const customer_entity_1 = require("../customer/entities/customer.entity");
const amenity_entity_1 = require("../amenity/entities/amenity.entity");
let PropertyService = class PropertyService {
    constructor(propertyModel) {
        this.propertyModel = propertyModel;
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery, status) {
        try {
            const page = parseInt(pageNumber, 10) || 1;
            const size = parseInt(pageSize, 10) || 10;
            const skip = (page - 1) * size;
            const query = {};
            if (searchQuery) {
                query.$or = [
                    { propertyTitle: { $regex: searchQuery, $options: 'i' } },
                    { propertyDescription: { $regex: searchQuery, $options: 'i' } },
                ];
            }
            if (status && status !== 'all') {
                query.status = status;
            }
            const totalProperties = await this.propertyModel.countDocuments(query);
            const totalPages = Math.ceil(totalProperties / size);
            const properties = await this.propertyModel
                .find(query)
                .skip(skip)
                .limit(size)
                .populate({
                path: 'amenities',
                model: amenity_entity_1.Amenity.name,
                strictPopulate: false,
            })
                .populate({
                path: 'facilities',
                model: amenity_entity_1.Amenity.name,
                strictPopulate: false,
            })
                .populate({
                path: 'builderId',
                strictPopulate: false,
            })
                .populate({
                path: 'projectId',
                strictPopulate: false,
            })
                .populate({
                path: 'customer',
                strictPopulate: false,
            })
                .populate({
                path: 'createdBy',
                strictPopulate: false,
            })
                .populate({
                path: 'updatedBy',
                strictPopulate: false,
            })
                .sort({ [sortBy]: sortOrder ? -1 : -1 });
            return {
                properties,
                totalProperties,
                totalPages,
                pageSize: size,
                pageNumber: parseInt(pageNumber),
            };
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const property = await this.propertyModel
                .findById(id)
                .populate({
                path: 'amenities',
                model: amenity_entity_1.Amenity.name,
                strictPopulate: false,
            })
                .populate({
                path: 'facilities',
                model: amenity_entity_1.Amenity.name,
                strictPopulate: false,
            })
                .populate({
                path: 'builderId',
                strictPopulate: false,
            })
                .populate({
                path: 'projectId',
                strictPopulate: false,
            })
                .populate({
                path: 'customer',
                strictPopulate: false,
            })
                .populate({
                path: 'createdBy',
                strictPopulate: false,
            })
                .populate({
                path: 'updatedBy',
                strictPopulate: false,
            })
                .exec();
            if (!property) {
                throw new common_1.NotFoundException('Property not found');
            }
            return property;
        }
        catch (error) {
            throw error;
        }
    }
    async create(createPropertyDto) {
        try {
            const createdProperty = new this.propertyModel(createPropertyDto);
            return await createdProperty.save();
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updatePropertyDto) {
        try {
            const updatedProperty = await this.propertyModel
                .findByIdAndUpdate(id, updatePropertyDto, { new: true })
                .exec();
            if (!updatedProperty) {
                throw new common_1.NotFoundException('Property not found');
            }
            return updatedProperty;
        }
        catch (error) {
            throw error;
        }
    }
    async remove(id) {
        try {
            const property = await this.propertyModel.findById(id).exec();
            if (!property) {
                throw new common_1.NotFoundException('Property not found');
            }
            await this.propertyModel.findByIdAndDelete(id).exec();
        }
        catch (error) {
            throw error;
        }
    }
    async getPropertySummaries() {
        const properties = await this.propertyModel
            .find({}, 'thumbnail propertyTitle address price propertyStatus totalArea bedCount pricePerUnit tags featured amenities')
            .populate({
            path: 'amenities',
            model: amenity_entity_1.Amenity.name,
            select: 'name iconImage',
            strictPopulate: false,
        })
            .populate({
            path: 'facilities',
            model: amenity_entity_1.Amenity.name,
            select: 'name iconImage',
            strictPopulate: false,
        })
            .exec();
        if (!properties.length) {
            throw new common_1.NotFoundException('No properties found.');
        }
        return properties;
    }
    async getPropertyById(id) {
        const property = await this.propertyModel
            .findById(id)
            .populate({
            path: 'customer',
            model: customer_entity_1.Customer.name,
        })
            .populate({
            strictPopulate: false,
            path: 'amenities',
            model: amenity_entity_1.Amenity.name,
        })
            .populate({
            strictPopulate: false,
            path: 'facilities',
            model: amenity_entity_1.Amenity.name,
        })
            .populate({
            path: 'builderId',
            strictPopulate: false,
        })
            .populate({
            path: 'projectId',
            strictPopulate: false,
        })
            .populate({
            path: 'createdBy',
            strictPopulate: false,
        })
            .populate({
            path: 'updatedBy',
            strictPopulate: false,
        })
            .exec();
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return {
            property,
            crmDetails: {
                crmName: 'crm name',
                crmProfileImageUrl: 'crm image',
                crmResponseTime: 'response tu=ime',
                crmMobile: '999999999999',
                crmRole: 'role',
            },
        };
    }
    async getPropertiesByProjectId(projectId) {
        const properties = await this.propertyModel
            .find({ projectId })
            .populate({
            path: 'amenities',
            model: amenity_entity_1.Amenity.name,
            strictPopulate: false,
        })
            .populate({
            path: 'facilities',
            model: amenity_entity_1.Amenity.name,
            strictPopulate: false,
        })
            .populate({
            path: 'builderId',
            strictPopulate: false,
        })
            .populate({
            path: 'projectId',
            strictPopulate: false,
        })
            .populate({
            path: 'customer',
            strictPopulate: false,
        })
            .exec();
        console.log('getPropertiesByProjectId', projectId, properties);
        if (!properties || properties.length === 0) {
            return [];
        }
        return properties;
    }
    async getPropertiesByCity(city) {
        const properties = await this.propertyModel
            .find({ city })
            .populate({
            path: 'amenities',
            model: amenity_entity_1.Amenity.name,
            strictPopulate: false,
        })
            .populate({
            path: 'facilities',
            model: amenity_entity_1.Amenity.name,
            strictPopulate: false,
        })
            .populate({
            path: 'builderId',
            strictPopulate: false,
        })
            .populate({
            path: 'projectId',
            strictPopulate: false,
        })
            .populate({
            path: 'customer',
            strictPopulate: false,
        })
            .exec();
        console.log('getPropertiesByProjectId', city, properties);
        if (!properties || properties.length === 0) {
            return [];
        }
        return properties;
    }
    async getFormattedProperties() {
        const properties = await this.propertyModel
            .aggregate([
            {
                $group: {
                    _id: {
                        city: '$city',
                        region: '$region',
                    },
                    properties: {
                        $push: {
                            _id: '$_id',
                            title: '$propertyTitle',
                            imageURL: { $arrayElemAt: ['$images', 0] },
                        },
                    },
                },
            },
            {
                $group: {
                    _id: {
                        city: '$_id.city',
                    },
                    regions: {
                        $push: {
                            _id: '$_id',
                            regionName: '$_id.region',
                            properties: '$properties',
                        },
                    },
                },
            },
            {
                $project: {
                    city: '$_id.city',
                    regions: 1,
                    _id: 1,
                },
            },
        ])
            .exec();
        return properties.map((district) => ({
            city: district.city,
            regions: district.regions.map((region) => ({
                regionName: region.regionName,
                regionImage: region.properties[0]?.imageURL || '',
                properties: region.properties.map((property) => ({
                    propertyId: property._id,
                    title: property.title,
                    imageURL: property.imageURL,
                })),
            })),
        }));
    }
    async createWeb(createPropertyDto) {
        try {
            const createdProperty = new this.propertyModel(createPropertyDto);
            return await createdProperty.save();
        }
        catch (error) {
            throw error;
        }
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(property_entity_1.Property.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PropertyService);
//# sourceMappingURL=property.service.js.map