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
var PropertyController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicPropertiesController = exports.AdminPropertyController = exports.BuilderPropertyController = exports.AgentPropertyController = exports.UserPropertyController = exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
const property_service_1 = require("./property.service");
const create_property_dto_1 = require("./dto/create-property.dto");
const update_property_dto_1 = require("./dto/update-property.dto");
const property_entity_1 = require("./entities/property.entity");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("../s3/s3.service");
const common_2 = require("@nestjs/common");
const recommondedProperty_dto_1 = require("./dto/recommondedProperty.dto");
const property_detail_dto_1 = require("./dto/property-detail.dto");
const status_enum_1 = require("../common/enum/status.enum");
const jwt_guard_1 = require("../core/guards/jwt.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const user_role_enum_1 = require("../common/enum/user-role.enum");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PropertyController = PropertyController_1 = class PropertyController {
    constructor(propertyService, s3Service) {
        this.propertyService = propertyService;
        this.s3Service = s3Service;
        this.logger = new common_2.Logger(PropertyController_1.name);
    }
    async getPropertiesByCreator(user, pageSize, pageNumber, searchQuery, status) {
        const data = await this.propertyService.findPropertiesByCreator(user.userId, pageSize, pageNumber, searchQuery, status);
        return { data, message: 'Properties retrieved successfully' };
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery, status) {
        try {
            const data = await this.propertyService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery, status);
            if (!data.properties || data.properties.length === 0) {
                throw new common_1.NotFoundException('No properties found');
            }
            return { data, message: 'Successfully retrieved properties' };
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        const property = await this.propertyService.findOne(id);
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        return { data: property, message: 'Successfully retrieved property' };
    }
    async create(createPropertyDto, user) {
        try {
            const userObjectId = new mongoose_1.Types.ObjectId(user.userId);
            createPropertyDto.createdBy = userObjectId.toString();
            createPropertyDto.updatedBy = userObjectId.toString();
            createPropertyDto.ownerId = userObjectId.toString();
            if (user.role === user_role_enum_1.UserRole.BUILDER || user.role === user_role_enum_1.UserRole.AGENT) {
                createPropertyDto.builderId = userObjectId.toString();
            }
            const data = await this.propertyService.create(createPropertyDto);
            return { data, message: 'Property created successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updatePropertyDto, user) {
        try {
            const data = await this.propertyService.update(id, updatePropertyDto, user.userId);
            return { data, message: 'Property updated successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async remove(id) {
        try {
            const property = await this.propertyService.findOne(id);
            if (!property) {
                throw new common_1.NotFoundException('Property not found');
            }
            await this.propertyService.remove(id);
            return { message: 'Property deleted successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async getPropertySummaries() {
        try {
            const data = await this.propertyService.getPropertySummaries();
            return { data, message: 'retrieve recommended property' };
        }
        catch (error) {
            throw error;
        }
    }
    async getPropertyById(id) {
        const data = await this.propertyService.findOne(id);
        return { data, message: 'retrieve successfully ' };
    }
    async getPropertyByCity(city) {
        const data = await this.propertyService.getPropertiesByCity(city);
        return { data, message: 'retrieve successfully ' };
    }
    async getFormattedProperties(res) {
        try {
            const formattedProperties = await this.propertyService.getFormattedProperties();
            return res.status(common_1.HttpStatus.OK).json(formattedProperties);
        }
        catch (error) {
            this.logger.error(`Error fetching formatted properties: ${error.message}`, error.stack);
            return error;
        }
    }
};
exports.PropertyController = PropertyController;
__decorate([
    (0, common_1.Get)('by-creator'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get properties by creator (JWT) with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'searchQuery', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: false }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Properties created by the authenticated user',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('pageNumber')),
    __param(3, (0, common_1.Query)('searchQuery')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertiesByCreator", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all properties with pagination, sorting, and search',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: false }),
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
        description: 'Search term for filtering properties by title or description',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of properties retrieved successfully',
        type: property_entity_1.Property,
        isArray: true,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No properties found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('property/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get property by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Property ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property details', type: property_entity_1.Property }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.AGENT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new property' }),
    (0, swagger_1.ApiBody)({ type: create_property_dto_1.CreatePropertyDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Property created successfully',
        type: property_entity_1.Property,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('thumbnail')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('property/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.AGENT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update property by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Property ID' }),
    (0, swagger_1.ApiBody)({ type: update_property_dto_1.UpdatePropertyDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Property updated successfully',
        type: property_entity_1.Property,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('thumbnail'), (0, platform_express_1.FilesInterceptor)('images', 10)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_dto_1.UpdatePropertyDto, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('property/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.AGENT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete property by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Property ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('recommended'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retrieve property summaries',
        type: [recommondedProperty_dto_1.PropertySummaryDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertySummaries", null);
__decorate([
    (0, common_1.Get)('property-by-id/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Property ID' }),
    (0, swagger_1.ApiOkResponse)({ type: property_detail_dto_1.PropertyDetailDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyById", null);
__decorate([
    (0, common_1.Get)('property-by-city/:city'),
    (0, swagger_1.ApiParam)({ name: 'city', description: 'city' }),
    (0, swagger_1.ApiOkResponse)({ type: property_detail_dto_1.PropertyDetailDto }),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyByCity", null);
__decorate([
    (0, common_1.Get)('region-wise'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getFormattedProperties", null);
exports.PropertyController = PropertyController = PropertyController_1 = __decorate([
    (0, swagger_1.ApiTags)('Properties'),
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [property_service_1.PropertyService,
        s3_service_1.S3Service])
], PropertyController);
let UserPropertyController = class UserPropertyController {
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    async findAll(page = 1, limit = 20, search, city, state, propertyType, propertyPurpose, minPrice, maxPrice, bedrooms, bathrooms, minArea, maxArea, featured, sortBy = 'createdAt', sortOrder = 'desc') {
        const data = await this.propertyService.findAllWithFilters({
            page,
            limit,
            search,
            city,
            state,
            propertyType,
            propertyPurpose,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            minArea,
            maxArea,
            featured,
            sortBy,
            sortOrder,
            status: status_enum_1.Status.ACTIVE,
        });
        return {
            data,
            message: 'Properties retrieved successfully',
        };
    }
    async findOne(id) {
        const data = await this.propertyService.findOneWithDetails(id);
        if (!data) {
            throw new common_1.NotFoundException('Property not found');
        }
        await this.propertyService.incrementViews(id);
        return {
            data,
            message: 'Property details retrieved successfully',
        };
    }
};
exports.UserPropertyController = UserPropertyController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Browse all properties with advanced filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'propertyType', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'propertyPurpose', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'bedrooms', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'bathrooms', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'minArea', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxArea', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'featured', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        enum: ['price', 'createdAt', 'totalArea', 'views'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Properties retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('city')),
    __param(4, (0, common_1.Query)('state')),
    __param(5, (0, common_1.Query)('propertyType')),
    __param(6, (0, common_1.Query)('propertyPurpose')),
    __param(7, (0, common_1.Query)('minPrice')),
    __param(8, (0, common_1.Query)('maxPrice')),
    __param(9, (0, common_1.Query)('bedrooms')),
    __param(10, (0, common_1.Query)('bathrooms')),
    __param(11, (0, common_1.Query)('minArea')),
    __param(12, (0, common_1.Query)('maxArea')),
    __param(13, (0, common_1.Query)('featured')),
    __param(14, (0, common_1.Query)('sortBy')),
    __param(15, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, Number, Number, Number, Number, Number, Number, Boolean, String, String]),
    __metadata("design:returntype", Promise)
], UserPropertyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get property details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property details retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserPropertyController.prototype, "findOne", null);
exports.UserPropertyController = UserPropertyController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('customer/properties'),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], UserPropertyController);
let AgentPropertyController = class AgentPropertyController {
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    async getBuilderProperties(user, page = 1, limit = 20, status, search, sortBy = 'createdAt', sortOrder = 'desc') {
        const data = await this.propertyService.findAgentProperties(user.userId, page, limit, status, search, sortBy, sortOrder);
        return {
            data,
            message: 'Properties retrieved successfully',
        };
    }
    async getMyStats(user) {
        const data = await this.propertyService.getOwnerStats(user.userId);
        return {
            data,
            message: 'Statistics retrieved successfully',
        };
    }
    async create(createPropertyDto, user) {
        const data = await this.propertyService.createProperty(createPropertyDto, user.userId);
        return {
            data,
            message: 'Property created successfully',
        };
    }
    async update(id, updatePropertyDto, user) {
        const property = await this.propertyService.findOne(id);
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const data = await this.propertyService.update(id, updatePropertyDto, user.userId);
        return {
            data,
            message: 'Property updated successfully',
        };
    }
    async remove(id, user) {
        const property = await this.propertyService.findOne(id);
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.ownerId?.toString() !== user.userId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this property');
        }
        await this.propertyService.remove(id);
        return {
            data: null,
            message: 'Property deleted successfully',
        };
    }
    async bookmarkProperty(id, user) {
        const data = await this.propertyService.bookmarkProperty(user.userId, id);
        return {
            data,
            message: 'Property bookmarked successfully',
        };
    }
    async removeBookmark(id, user) {
        const data = await this.propertyService.removeBookmark(user.userId, id);
        return {
            data,
            message: 'Bookmark removed successfully',
        };
    }
    async getBookmarkedProperties(user, page = 1, limit = 20) {
        const data = await this.propertyService.getBookmarkedProperties(user.userId, page, limit);
        return {
            data,
            message: 'Bookmarked properties retrieved successfully',
        };
    }
    async getTopLocations(limit = 10) {
        const data = await this.propertyService.getTopLocations(limit);
        return {
            data,
            message: 'Top locations retrieved successfully',
        };
    }
    async getNearbyProperties(id, limit = 10) {
        const data = await this.propertyService.getNearbyProperties(id, limit);
        return {
            data,
            message: 'Nearby properties retrieved successfully',
        };
    }
    async getRecommendations(user, limit = 10) {
        const data = await this.propertyService.getRecommendations(user.userId, limit);
        return {
            data,
            message: 'Recommendations retrieved successfully',
        };
    }
};
exports.AgentPropertyController = AgentPropertyController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Get builder's properties",
        description: 'Retrieve all properties owned by the authenticated builder with advanced filtering, sorting, and pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 20)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: status_enum_1.Status,
        description: 'Filter by property status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        description: 'Search by property title or location',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        enum: ['price', 'createdAt', 'views'],
        description: 'Field to sort by (default: createdAt)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        required: false,
        enum: ['asc', 'desc'],
        description: 'Sort order (default: desc)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Properties retrieved successfully with pagination',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('sortBy')),
    __param(6, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "getBuilderProperties", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my property statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new property' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Property created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto, Object]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update property' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_dto_1.UpdatePropertyDto, Object]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete property' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/bookmark'),
    (0, swagger_1.ApiOperation)({ summary: 'Bookmark property' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property bookmarked successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "bookmarkProperty", null);
__decorate([
    (0, common_1.Delete)(':id/bookmark'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove bookmark' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookmark removed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "removeBookmark", null);
__decorate([
    (0, common_1.Get)('bookmarked/list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bookmarked properties' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookmarked properties retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "getBookmarkedProperties", null);
__decorate([
    (0, common_1.Get)('top-locations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top property locations' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Top locations retrieved' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "getTopLocations", null);
__decorate([
    (0, common_1.Get)(':id/nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nearby properties' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nearby properties retrieved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "getNearbyProperties", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get personalized property recommendations' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recommendations retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AgentPropertyController.prototype, "getRecommendations", null);
exports.AgentPropertyController = AgentPropertyController = __decorate([
    (0, swagger_1.ApiTags)('Agent'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('agent/properties'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.AGENT),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], AgentPropertyController);
let BuilderPropertyController = class BuilderPropertyController {
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    async getBuilderProperties(user, page = 1, limit = 20, status, search, sortBy = 'createdAt', sortOrder = 'desc') {
        const data = await this.propertyService.findBuilderProperties(user.userId, page, limit, status, search, sortBy, sortOrder);
        return {
            data,
            message: 'Properties retrieved successfully',
        };
    }
    async create(createPropertyDto, user) {
        const data = await this.propertyService.createBuilderProperty(createPropertyDto, user.userId);
        return {
            data,
            message: 'Property created successfully',
        };
    }
};
exports.BuilderPropertyController = BuilderPropertyController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Get builder's properties",
        description: 'Retrieve all properties owned by the authenticated builder with advanced filtering, sorting, and pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 20)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: status_enum_1.Status,
        description: 'Filter by property status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        description: 'Search by property title or location',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        enum: ['price', 'createdAt', 'views'],
        description: 'Field to sort by (default: createdAt)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        required: false,
        enum: ['asc', 'desc'],
        description: 'Sort order (default: desc)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Properties retrieved successfully with pagination',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('sortBy')),
    __param(6, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BuilderPropertyController.prototype, "getBuilderProperties", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new property',
        description: 'Builder creates a new property listing with complete details including amenities, pricing, and media',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Property created successfully with active status',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid property data' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto, Object]),
    __metadata("design:returntype", Promise)
], BuilderPropertyController.prototype, "create", null);
exports.BuilderPropertyController = BuilderPropertyController = __decorate([
    (0, swagger_1.ApiTags)('Builder'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('builder/properties'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], BuilderPropertyController);
let AdminPropertyController = class AdminPropertyController {
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    async getPendingProperties(page = 1, limit = 20) {
        const data = await this.propertyService.findPendingProperties(page, limit);
        return {
            data,
            message: 'Pending properties retrieved successfully',
        };
    }
    async getStats() {
        const data = await this.propertyService.getApprovalStats();
        return {
            data,
            message: 'Statistics retrieved successfully',
        };
    }
    async approve(id, user) {
        const data = await this.propertyService.approveProperty(id, user.userId);
        return {
            data,
            message: 'Property approved successfully',
        };
    }
    async reject(id, reason, user) {
        const data = await this.propertyService.rejectProperty(id, reason, user.userId);
        return {
            data,
            message: 'Property rejected successfully',
        };
    }
    async getAllProperties(page = 1, limit = 20, status, search, sortBy = 'createdAt', sortOrder = 'desc') {
        const data = await this.propertyService.findAllForAdmin(page, limit, status, search, sortBy, sortOrder);
        return {
            data,
            message: 'All properties retrieved successfully',
        };
    }
    async createProperty(createPropertyDto, user) {
        const data = await this.propertyService.createPropertyAsAdmin(createPropertyDto, user.userId);
        return {
            data,
            message: 'Property created successfully',
        };
    }
    async updateProperty(id, updatePropertyDto, user) {
        const data = await this.propertyService.updatePropertyAsAdmin(id, updatePropertyDto, user.userId);
        return {
            data,
            message: 'Property updated successfully',
        };
    }
    async deleteProperty(id) {
        await this.propertyService.deletePropertyAsAdmin(id);
        return {
            data: null,
            message: 'Property deleted successfully',
        };
    }
};
exports.AdminPropertyController = AdminPropertyController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending properties for approval' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending properties retrieved' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminPropertyController.prototype, "getPendingProperties", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get approval statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPropertyController.prototype, "getStats", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve property' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property approved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminPropertyController.prototype, "approve", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject property' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property rejected successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminPropertyController.prototype, "reject", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all properties (admin view)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: status_enum_1.Status }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All properties retrieved' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminPropertyController.prototype, "getAllProperties", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create property (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Property created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPropertyController.prototype, "createProperty", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update property (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPropertyController.prototype, "updateProperty", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete property (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPropertyController.prototype, "deleteProperty", null);
exports.AdminPropertyController = AdminPropertyController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/properties'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], AdminPropertyController);
let PublicPropertiesController = class PublicPropertiesController {
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    async findAll(filters) {
        const data = await this.propertyService.findAllApproved(filters);
        return {
            data,
            message: 'Properties retrieved successfully',
        };
    }
    async getFeatured(limit) {
        const data = await this.propertyService.getFeatured(limit);
        return {
            data,
            message: 'Featured properties retrieved successfully',
        };
    }
    async search(query, filters) {
        const data = await this.propertyService.search(query, filters);
        return {
            data,
            message: 'Search results retrieved successfully',
        };
    }
    async getNearby(latitude, longitude, radius, limit) {
        const data = await this.propertyService.getNearby(Number(latitude), Number(longitude), radius ? Number(radius) : 5, limit ? Number(limit) : 10);
        return {
            data,
            message: 'Nearby properties retrieved successfully',
        };
    }
    async findOne(id) {
        const data = await this.propertyService.findOneApproved(id);
        return {
            data,
            message: 'Property details retrieved successfully',
        };
    }
};
exports.PublicPropertiesController = PublicPropertiesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Browse all approved properties' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, example: 'Bangalore' }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false, example: 'Karnataka' }),
    (0, swagger_1.ApiQuery)({ name: 'propertyType', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'propertyPurpose', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, example: 1000000 }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, example: 10000000 }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, example: 'createdAt' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Properties retrieved successfully',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicPropertiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured properties' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Featured properties retrieved' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicPropertiesController.prototype, "getFeatured", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search properties by text' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: true, example: 'luxury apartment' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search results' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PublicPropertiesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Get properties near a location' }),
    (0, swagger_1.ApiQuery)({ name: 'latitude', required: true, example: 12.9716 }),
    (0, swagger_1.ApiQuery)({ name: 'longitude', required: true, example: 77.5946 }),
    (0, swagger_1.ApiQuery)({
        name: 'radius',
        required: false,
        example: 5,
        description: 'Radius in km',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nearby properties retrieved' }),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], PublicPropertiesController.prototype, "getNearby", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get property details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicPropertiesController.prototype, "findOne", null);
exports.PublicPropertiesController = PublicPropertiesController = __decorate([
    (0, swagger_1.ApiTags)('Public Properties'),
    (0, common_1.Controller)('public/properties'),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], PublicPropertiesController);
//# sourceMappingURL=property.controller.js.map