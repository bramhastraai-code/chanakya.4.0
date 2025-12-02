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
exports.AmenityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const amenity_service_1 = require("./amenity.service");
const amenity_entity_1 = require("./entities/amenity.entity");
const create_amenity_dto_1 = require("./dto/create-amenity.dto");
const update_amenity_dto_1 = require("./dto/update-amenity.dto");
const jwt_guard_1 = require("../core/guards/jwt.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enum/user-role.enum");
let AmenityController = class AmenityController {
    constructor(amenityService) {
        this.amenityService = amenityService;
    }
    async create(createAmenityDto) {
        try {
            const data = await this.amenityService.create(createAmenityDto);
            console.log('amenities create', data);
            return { data, message: 'amenities created' };
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateAmenityDto) {
        try {
            const updatedAmenity = await this.amenityService.update(id, updateAmenityDto);
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
            const data = await this.amenityService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery);
            if (!data.amenities || data.amenities.length === 0) {
                throw new common_1.NotFoundException('No amenities found');
            }
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving amenities.');
        }
    }
    async findOne(id) {
        try {
            const amenity = await this.amenityService.findOne(id);
            if (!amenity) {
                throw new common_1.NotFoundException('Amenity not found');
            }
            return { data: amenity, message: 'retrieve successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving the amenity.');
        }
    }
    async remove(id) {
        try {
            const result = await this.amenityService.remove(id);
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Amenity not found');
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while deleting the amenity.');
        }
    }
    async amenityList() {
        try {
            const data = await this.amenityService.AmenityList();
            if (!data || data.length === 0) {
                throw new common_1.NotFoundException('No amenities found');
            }
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AmenityController = AmenityController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new amenity (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Amenity created successfully',
        type: amenity_entity_1.Amenity,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden - admin only',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_amenity_dto_1.CreateAmenityDto]),
    __metadata("design:returntype", Promise)
], AmenityController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('amenity/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing amenity (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Amenity updated successfully',
        type: amenity_entity_1.Amenity,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Amenity not found',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden - admin only',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_amenity_dto_1.UpdateAmenityDto]),
    __metadata("design:returntype", Promise)
], AmenityController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all amenities with pagination, sorting, and search',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        type: Number,
        required: true,
        description: 'Number of amenities per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageNumber',
        type: Number,
        required: true,
        description: 'Page number to retrieve',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        type: String,
        required: false,
        enum: ['name', 'createdAt', 'updatedAt'],
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        type: String,
        required: false,
        enum: ['asc', 'desc'],
        description: 'Sort order',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        type: String,
        required: false,
        description: 'Search term for filtering amenities',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of amenities retrieved successfully',
        type: [amenity_entity_1.Amenity],
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'No amenities found',
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AmenityController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('amenity/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a single amenity by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The amenity details',
        type: amenity_entity_1.Amenity,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Amenity not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmenityController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)('amenity/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an amenity by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Amenity deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Amenity not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmenityController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('amenity-list'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all amenities',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of amenities retrieved successfully',
        type: [amenity_entity_1.Amenity],
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'No amenities found',
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AmenityController.prototype, "amenityList", null);
exports.AmenityController = AmenityController = __decorate([
    (0, swagger_1.ApiTags)('amenities'),
    (0, common_1.Controller)('amenities'),
    __metadata("design:paramtypes", [amenity_service_1.AmenityService])
], AmenityController);
//# sourceMappingURL=amenity.controller.js.map