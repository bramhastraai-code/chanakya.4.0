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
var PropertyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const property_entity_1 = require("./entities/property.entity");
const amenity_entity_1 = require("../amenity/entities/amenity.entity");
const status_enum_1 = require("../common/enum/status.enum");
const bookmarked_property_entity_1 = require("./entities/bookmarked-property.entity");
let PropertyService = PropertyService_1 = class PropertyService {
    constructor(propertyModel, bookmarkedPropertyModel) {
        this.propertyModel = propertyModel;
        this.bookmarkedPropertyModel = bookmarkedPropertyModel;
        this.logger = new common_1.Logger(PropertyService_1.name);
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery, status) {
        const page = parseInt(pageNumber, 10) || 1;
        const size = parseInt(pageSize, 10) || 10;
        const skip = (page - 1) * size;
        this.logger.log(`Fetching properties - Page: ${page}, Size: ${size}, Status: ${status || 'all'}`);
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
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });
        return {
            properties,
            totalProperties,
            totalPages,
            pageSize: size,
            pageNumber: page,
        };
    }
    async findOne(id) {
        this.logger.log(`Fetching property with ID: ${id}`);
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
            throw new common_1.NotFoundException(`Property with ID '${id}' not found`);
        }
        return property;
    }
    async findOneWithDetails(id) {
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
            select: 'name phoneNumber email rating closedDeals',
            strictPopulate: false,
        })
            .exec();
        if (!property) {
            return null;
        }
        return property;
    }
    async create(createPropertyDto) {
        this.logger.log(`Creating property: ${createPropertyDto.propertyTitle}`);
        const createdProperty = new this.propertyModel(createPropertyDto);
        return await createdProperty.save();
    }
    async update(id, updatePropertyDto, userId) {
        this.logger.log(`Updating property with ID: ${id}`);
        const updateData = userId
            ? { ...updatePropertyDto, updatedBy: userId }
            : updatePropertyDto;
        const updatedProperty = await this.propertyModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!updatedProperty) {
            throw new common_1.NotFoundException(`Property with ID '${id}' not found`);
        }
        return updatedProperty;
    }
    async remove(id) {
        this.logger.log(`Deleting property with ID: ${id}`);
        const property = await this.propertyModel.findById(id).exec();
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID '${id}' not found`);
        }
        await this.propertyModel.findByIdAndDelete(id).exec();
    }
    async findPropertiesByCreator(creatorId, pageSize, pageNumber, searchQuery, status) {
        const page = parseInt(pageNumber, 10) || 1;
        const size = parseInt(pageSize, 10) || 10;
        const skip = (page - 1) * size;
        this.logger.log(`Fetching properties by creator: ${creatorId}`);
        const query = { createdBy: creatorId };
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
            .sort({ createdAt: -1 });
        return {
            properties,
            totalProperties,
            totalPages,
            pageSize: size,
            pageNumber: page,
        };
    }
    async findByOwner(ownerId, filters = {}) {
        const { page = 1, limit = 20, approvalStatus } = filters;
        const query = { ownerId };
        if (approvalStatus)
            query.approvalStatus = approvalStatus;
        const skip = (Number(page) - 1) * Number(limit);
        const [properties, total] = await Promise.all([
            this.propertyModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .exec(),
            this.propertyModel.countDocuments(query),
        ]);
        return {
            properties,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }
    async getOwnerStats(ownerId) {
        const [total, pending, approved, rejected, totalViews] = await Promise.all([
            this.propertyModel.countDocuments({ ownerId }),
            this.propertyModel.countDocuments({ ownerId, approvalStatus: 'pending' }),
            this.propertyModel.countDocuments({
                ownerId,
                approvalStatus: 'approved',
            }),
            this.propertyModel.countDocuments({
                ownerId,
                approvalStatus: 'rejected',
            }),
            this.propertyModel.aggregate([
                { $match: { ownerId: new mongoose_2.Types.ObjectId(ownerId) } },
                { $group: { _id: null, totalViews: { $sum: '$views' } } },
            ]),
        ]);
        return {
            total,
            pending,
            approved,
            rejected,
            totalViews: totalViews[0]?.totalViews || 0,
        };
    }
    async findAgentProperties(agentId, page, limit, status, search, sortBy = 'createdAt', sortOrder = 'desc') {
        const query = { customer: agentId };
        if (status) {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { propertyTitle: { $regex: search, $options: 'i' } },
                { propertyDescription: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (page - 1) * limit;
        const sortObject = {};
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const [properties, total] = await Promise.all([
            this.propertyModel
                .find(query)
                .populate({
                path: 'amenities',
                model: amenity_entity_1.Amenity.name,
                strictPopulate: false,
            })
                .sort(sortObject)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.propertyModel.countDocuments(query),
        ]);
        return {
            properties,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
        };
    }
    async createProperty(createPropertyDto, agentId) {
        const property = new this.propertyModel({
            ...createPropertyDto,
            customer: agentId,
            createdBy: agentId,
            status: status_enum_1.Status.IN_ACTIVE,
            views: 0,
        });
        return await property.save();
    }
    async findBuilderProperties(builderId, page, limit, status, search, sortBy = 'createdAt', sortOrder = 'desc') {
        const query = { builderId };
        if (status) {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { propertyTitle: { $regex: search, $options: 'i' } },
                { propertyDescription: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (page - 1) * limit;
        const sortObject = {};
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const [properties, total] = await Promise.all([
            this.propertyModel
                .find(query)
                .populate({
                path: 'amenities',
                model: amenity_entity_1.Amenity.name,
                strictPopulate: false,
            })
                .populate({
                path: 'projectId',
                strictPopulate: false,
            })
                .sort(sortObject)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.propertyModel.countDocuments(query),
        ]);
        return {
            properties,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
        };
    }
    async createBuilderProperty(createPropertyDto, builderId) {
        const property = new this.propertyModel({
            ...createPropertyDto,
            builderId,
            createdBy: builderId,
            status: status_enum_1.Status.IN_ACTIVE,
            views: 0,
        });
        return await property.save();
    }
    async findAllForAdmin(page, limit, status, search, sortBy = 'createdAt', sortOrder = 'desc') {
        const query = {};
        if (status) {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { propertyTitle: { $regex: search, $options: 'i' } },
                { propertyDescription: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (page - 1) * limit;
        const sortObject = {};
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const [properties, total, stats] = await Promise.all([
            this.propertyModel
                .find(query)
                .populate({
                path: 'customer',
                select: 'name phoneNumber email',
                strictPopulate: false,
            })
                .populate({
                path: 'builderId',
                strictPopulate: false,
            })
                .sort(sortObject)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.propertyModel.countDocuments(query),
            this.getPropertyStats(),
        ]);
        return {
            properties,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
            stats,
        };
    }
    async findPendingProperties(page, limit) {
        const query = { status: status_enum_1.Status.IN_ACTIVE };
        const skip = (page - 1) * limit;
        const [properties, total] = await Promise.all([
            this.propertyModel
                .find(query)
                .populate({
                path: 'customer',
                select: 'name phoneNumber email',
                strictPopulate: false,
            })
                .populate({
                path: 'builderId',
                strictPopulate: false,
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.propertyModel.countDocuments(query),
        ]);
        return {
            properties,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
        };
    }
    async approveProperty(id, adminId) {
        const property = await this.propertyModel.findById(id);
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.status === status_enum_1.Status.ACTIVE) {
            throw new common_1.BadRequestException('Property is already approved');
        }
        property.status = status_enum_1.Status.ACTIVE;
        property.updatedBy = adminId;
        property.approvalStatus = 'approved';
        property.approvedBy = adminId;
        property.approvedAt = new Date();
        await property.save();
        return property;
    }
    async rejectProperty(id, reason, adminId) {
        const property = await this.propertyModel.findById(id);
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        property.status = status_enum_1.Status.IN_ACTIVE;
        property.updatedBy = adminId;
        property.approvalStatus = 'rejected';
        property.approvedBy = adminId;
        property.approvedAt = new Date();
        property.rejectionReason = reason;
        await property.save();
        return property;
    }
    async createPropertyAsAdmin(createPropertyDto, adminId) {
        const property = await this.propertyModel.create({
            ...createPropertyDto,
            createdBy: adminId,
            updatedBy: adminId,
            status: status_enum_1.Status.ACTIVE,
            approvalStatus: 'approved',
        });
        return property;
    }
    async updatePropertyAsAdmin(id, updatePropertyDto, adminId) {
        const property = await this.propertyModel.findById(id);
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        Object.assign(property, updatePropertyDto);
        property.updatedBy = adminId;
        await property.save();
        return property;
    }
    async deletePropertyAsAdmin(id) {
        const property = await this.propertyModel.findById(id);
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        await this.propertyModel.findByIdAndDelete(id);
        return { deleted: true };
    }
    async getPropertyStats() {
        const [total, active, pending, totalViews] = await Promise.all([
            this.propertyModel.countDocuments(),
            this.propertyModel.countDocuments({ status: status_enum_1.Status.ACTIVE }),
            this.propertyModel.countDocuments({ status: status_enum_1.Status.IN_ACTIVE }),
            this.propertyModel.aggregate([
                { $group: { _id: null, totalViews: { $sum: '$views' } } },
            ]),
        ]);
        return {
            total,
            active,
            pending,
            totalViews: totalViews[0]?.totalViews || 0,
        };
    }
    async getPendingApprovals(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [properties, total] = await Promise.all([
            this.propertyModel
                .find({ approvalStatus: 'pending' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('ownerId', 'email')
                .exec(),
            this.propertyModel.countDocuments({ approvalStatus: 'pending' }),
        ]);
        return {
            properties,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getApprovalStats() {
        const [pending, approved, rejected, total] = await Promise.all([
            this.propertyModel.countDocuments({ approvalStatus: 'pending' }),
            this.propertyModel.countDocuments({ approvalStatus: 'approved' }),
            this.propertyModel.countDocuments({ approvalStatus: 'rejected' }),
            this.propertyModel.countDocuments(),
        ]);
        return {
            pending,
            approved,
            rejected,
            total,
        };
    }
    async findAllWithFilters(options) {
        const { page, limit, search, city, state, propertyType, propertyPurpose, minPrice, maxPrice, bedrooms, bathrooms, minArea, maxArea, featured, sortBy, sortOrder, status, } = options;
        const query = {};
        if (status) {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { propertyTitle: { $regex: search, $options: 'i' } },
                { propertyDescription: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
            ];
        }
        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }
        if (state) {
            query.state = { $regex: state, $options: 'i' };
        }
        if (propertyType) {
            query.propertyType = propertyType;
        }
        if (propertyPurpose) {
            query.propertyPurpose = propertyPurpose;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined)
                query.price.$gte = minPrice;
            if (maxPrice !== undefined)
                query.price.$lte = maxPrice;
        }
        if (bedrooms !== undefined) {
            query.bedCount = bedrooms;
        }
        if (bathrooms !== undefined) {
            query.bathroomCount = bathrooms;
        }
        if (minArea !== undefined || maxArea !== undefined) {
            query.totalArea = {};
            if (minArea !== undefined)
                query.totalArea.$gte = minArea;
            if (maxArea !== undefined)
                query.totalArea.$lte = maxArea;
        }
        if (featured !== undefined) {
            query.featured = featured;
        }
        const skip = (page - 1) * limit;
        const sortObject = {};
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const [properties, total] = await Promise.all([
            this.propertyModel
                .find(query)
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
                path: 'customer',
                select: 'name phoneNumber email',
                strictPopulate: false,
            })
                .sort(sortObject)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.propertyModel.countDocuments(query),
        ]);
        return {
            properties,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        };
    }
    async findAllApproved(filters = {}) {
        const { page = 1, limit = 20, city, state, propertyType, propertyPurpose, minPrice, maxPrice, bhkConfiguration, sortBy = 'createdAt', sortOrder = 'desc', } = filters;
        const query = {
            approvalStatus: 'approved',
            status: status_enum_1.Status.ACTIVE,
        };
        if (city)
            query.city = new RegExp(city, 'i');
        if (state)
            query.state = new RegExp(state, 'i');
        if (propertyType)
            query.propertyType = propertyType;
        if (propertyPurpose)
            query.propertyPurpose = propertyPurpose;
        if (bhkConfiguration)
            query.bhkConfiguration = bhkConfiguration;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        const skip = (Number(page) - 1) * Number(limit);
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const [properties, total] = await Promise.all([
            this.propertyModel
                .find(query)
                .sort(sort)
                .skip(skip)
                .limit(Number(limit))
                .populate('ownerId', 'email')
                .exec(),
            this.propertyModel.countDocuments(query),
        ]);
        return {
            properties,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }
    async search(searchQuery, filters = {}) {
        const { page = 1, limit = 20 } = filters;
        const query = {
            approvalStatus: 'approved',
            status: status_enum_1.Status.ACTIVE,
            $or: [
                { propertyTitle: { $regex: searchQuery, $options: 'i' } },
                { propertyDescription: { $regex: searchQuery, $options: 'i' } },
                { address: { $regex: searchQuery, $options: 'i' } },
            ],
        };
        const skip = (Number(page) - 1) * Number(limit);
        const [properties, total] = await Promise.all([
            this.propertyModel
                .find(query)
                .skip(skip)
                .limit(Number(limit))
                .populate('ownerId', 'email')
                .exec(),
            this.propertyModel.countDocuments(query),
        ]);
        return {
            properties,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
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
        this.logger.log(`Found ${properties.length} properties for project: ${projectId}`);
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
        this.logger.log(`Found ${properties.length} properties in city: ${city}`);
        if (!properties || properties.length === 0) {
            return [];
        }
        return properties;
    }
    async getFeatured(limit = 10) {
        const properties = await this.propertyModel
            .find({
            featured: true,
            approvalStatus: 'approved',
            status: status_enum_1.Status.ACTIVE,
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('ownerId', 'email')
            .exec();
        return properties;
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
    async getTopLocations(limit = 10) {
        const topCities = await this.propertyModel.aggregate([
            { $match: { status: status_enum_1.Status.ACTIVE } },
            {
                $group: {
                    _id: '$city',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                },
            },
            { $sort: { count: -1 } },
            { $limit: limit },
        ]);
        return topCities.map((city) => ({
            city: city._id,
            propertyCount: city.count,
            averagePrice: Math.round(city.avgPrice),
        }));
    }
    async getNearbyProperties(propertyId, limit = 10) {
        const property = await this.propertyModel.findById(propertyId);
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const priceRange = property.price * 0.2;
        const nearbyProperties = await this.propertyModel
            .find({
            _id: { $ne: propertyId },
            city: property.city,
            status: status_enum_1.Status.ACTIVE,
            price: {
                $gte: property.price - priceRange,
                $lte: property.price + priceRange,
            },
        })
            .populate({
            path: 'amenities',
            model: amenity_entity_1.Amenity.name,
            strictPopulate: false,
        })
            .limit(limit)
            .exec();
        return nearbyProperties;
    }
    async getNearby(latitude, longitude, radiusKm = 5, limit = 10) {
        const properties = await this.propertyModel
            .find({
            approvalStatus: 'approved',
            status: status_enum_1.Status.ACTIVE,
            latitude: { $exists: true },
            longitude: { $exists: true },
        })
            .limit(limit * 3)
            .populate('ownerId', 'email')
            .exec();
        const nearby = properties
            .map((property) => {
            const distance = this.calculateDistance(latitude, longitude, property.latitude, property.longitude);
            return { property, distance };
        })
            .filter((item) => item.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, limit)
            .map((item) => ({
            ...item.property.toObject(),
            distance: item.distance,
        }));
        return nearby;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
                Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(degrees) {
        return (degrees * Math.PI) / 180;
    }
    async bookmarkProperty(agentId, propertyId) {
        const property = await this.propertyModel.findById(propertyId);
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const existing = await this.bookmarkedPropertyModel.findOne({
            agent: agentId,
            property: propertyId,
        });
        if (existing) {
            throw new common_1.ConflictException('Property already bookmarked');
        }
        const bookmark = new this.bookmarkedPropertyModel({
            agent: agentId,
            property: propertyId,
        });
        await bookmark.save();
        return { message: 'Property bookmarked successfully' };
    }
    async removeBookmark(agentId, propertyId) {
        const result = await this.bookmarkedPropertyModel.findOneAndDelete({
            agent: agentId,
            property: propertyId,
        });
        if (!result) {
            throw new common_1.NotFoundException('Bookmark not found');
        }
        return { message: 'Bookmark removed successfully' };
    }
    async getBookmarkedProperties(agentId, page, limit) {
        const skip = (page - 1) * limit;
        const [bookmarks, total] = await Promise.all([
            this.bookmarkedPropertyModel
                .find({ agent: agentId })
                .populate({
                path: 'property',
                populate: [
                    {
                        path: 'amenities',
                        model: amenity_entity_1.Amenity.name,
                        strictPopulate: false,
                    },
                    {
                        path: 'customer',
                        select: 'name phoneNumber email',
                        strictPopulate: false,
                    },
                ],
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.bookmarkedPropertyModel.countDocuments({ agent: agentId }),
        ]);
        const properties = bookmarks.map((b) => b.property);
        return {
            properties,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
        };
    }
    async getRecommendations(agentId, limit = 10) {
        const bookmarks = await this.bookmarkedPropertyModel
            .find({ agent: agentId })
            .populate('property')
            .limit(5)
            .exec();
        if (bookmarks.length === 0) {
            return await this.propertyModel
                .find({ status: status_enum_1.Status.ACTIVE })
                .sort({ views: -1 })
                .limit(limit)
                .populate({
                path: 'amenities',
                model: amenity_entity_1.Amenity.name,
                strictPopulate: false,
            })
                .exec();
        }
        const properties = bookmarks.map((b) => b.property);
        const cities = [...new Set(properties.map((p) => p.city))];
        const propertyTypes = [
            ...new Set(properties.map((p) => p.propertyType)),
        ];
        const recommendations = await this.propertyModel
            .find({
            status: status_enum_1.Status.ACTIVE,
            $or: [
                { city: { $in: cities } },
                { propertyType: { $in: propertyTypes } },
            ],
        })
            .sort({ views: -1, createdAt: -1 })
            .limit(limit)
            .populate({
            path: 'amenities',
            model: amenity_entity_1.Amenity.name,
            strictPopulate: false,
        })
            .exec();
        return recommendations;
    }
    async incrementViews(id) {
        await this.propertyModel.findByIdAndUpdate(id, {
            $inc: { views: 1 },
        });
    }
    async findOneApproved(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid property ID');
        }
        const property = await this.propertyModel
            .findById(id)
            .populate('ownerId', 'email')
            .populate('amenities')
            .populate('facilities')
            .exec();
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.approvalStatus !== 'approved') {
            throw new common_1.NotFoundException('Property not found');
        }
        await this.incrementViews(id);
        return property;
    }
    async createWeb(createPropertyDto) {
        this.logger.log(`Creating property via web: ${createPropertyDto.propertyTitle}`);
        const createdProperty = new this.propertyModel(createPropertyDto);
        return await createdProperty.save();
    }
    async createForOwner(ownerId, dto) {
        const property = await this.propertyModel.create({
            ...dto,
            ownerId,
            createdBy: ownerId,
            approvalStatus: 'pending',
            status: status_enum_1.Status.ACTIVE,
        });
        return property;
    }
    async updateForOwner(id, ownerId, dto) {
        const property = await this.findOne(id);
        if (property.ownerId?.toString() !== ownerId.toString()) {
            throw new common_1.ForbiddenException('You can only update your own properties');
        }
        Object.assign(property, dto);
        property.updatedBy = ownerId;
        await property.save();
        return property;
    }
    async deleteForOwner(id, ownerId) {
        const property = await this.findOne(id);
        if (property.ownerId?.toString() !== ownerId.toString()) {
            throw new common_1.ForbiddenException('You can only delete your own properties');
        }
        await this.propertyModel.findByIdAndDelete(id);
        return { message: 'Property deleted successfully' };
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = PropertyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(property_entity_1.Property.name)),
    __param(1, (0, mongoose_1.InjectModel)(bookmarked_property_entity_1.BookmarkedProperty.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PropertyService);
//# sourceMappingURL=property.service.js.map