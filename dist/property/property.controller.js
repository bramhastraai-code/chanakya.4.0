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
exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const property_service_1 = require("./property.service");
const create_property_dto_1 = require("./dto/create-property.dto");
const property_entity_1 = require("./entities/property.entity");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("../s3/s3.service");
const update_property_dto_1 = require("./dto/update-property.dto");
const recommondedProperty_dto_1 = require("./dto/recommondedProperty.dto");
const property_detail_dto_1 = require("./dto/property-detail.dto");
const status_enum_1 = require("../common/enum/status.enum");
const jwt_guard_1 = require("../core/guards/jwt.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const user_role_enum_1 = require("../common/enum/user-role.enum");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PropertyController = class PropertyController {
    constructor(propertyService, s3Service) {
        this.propertyService = propertyService;
        this.s3Service = s3Service;
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
            createPropertyDto.createdBy = user.userId;
            createPropertyDto.updatedBy = user.userId;
            createPropertyDto.ownerId = user.userId;
            if (user.role === user_role_enum_1.UserRole.BUILDER || user.role === user_role_enum_1.UserRole.AGENT) {
                createPropertyDto.builderId = user.userId;
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
            updatePropertyDto.updatedBy = user.userId;
            const data = await this.propertyService.update(id, updatePropertyDto);
            return { data, message: 'Property updated successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while updating the property.');
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
            console.error('Error fetching formatted properties:', error);
            return error;
        }
    }
    async createWeb(createPropertyDto, user) {
        try {
            createPropertyDto.createdBy = user.userId;
            createPropertyDto.updatedBy = user.userId;
            createPropertyDto.ownerId = user.userId;
            if (user.role === user_role_enum_1.UserRole.BUILDER || user.role === user_role_enum_1.UserRole.AGENT) {
                createPropertyDto.builderId = user.userId;
            }
            const data = await this.propertyService.createWeb(createPropertyDto);
            return { data, message: 'Property created successfully' };
        }
        catch (error) {
            throw error;
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
__decorate([
    (0, common_1.Post)('create-web'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new property' }),
    (0, swagger_1.ApiBody)({ type: create_property_dto_1.CreatePropertyDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Property created successfully',
        type: property_entity_1.Property,
    }),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.AGENT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('thumbnail')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "createWeb", null);
exports.PropertyController = PropertyController = __decorate([
    (0, swagger_1.ApiTags)('Properties'),
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [property_service_1.PropertyService,
        s3_service_1.S3Service])
], PropertyController);
//# sourceMappingURL=property.controller.js.map