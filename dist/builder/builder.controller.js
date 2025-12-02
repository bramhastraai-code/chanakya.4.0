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
exports.BuilderController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const status_enum_1 = require("../common/enum/status.enum");
const project_service_1 = require("../project/project.service");
const builder_service_1 = require("./builder.service");
const create_builder_dto_1 = require("./dto/create-builder.dto");
const update_builder_dto_1 = require("./dto/update-builder.dto");
const builder_entity_1 = require("./entities/builder.entity");
let BuilderController = class BuilderController {
    constructor(builderService, projectService) {
        this.builderService = builderService;
        this.projectService = projectService;
    }
    async create(createBuilderDto) {
        try {
            const data = await this.builderService.create(createBuilderDto);
            return { data, message: 'created successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery, status) {
        try {
            const data = await this.builderService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery, status);
            if (!data.builders || data.builders.length === 0) {
                throw new common_1.NotFoundException('No builders found');
            }
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving builders.');
        }
    }
    async findByOwnerId(req) {
        try {
            const ownerId = req.user._id;
            const builders = await this.builderService.findByOwnerId(ownerId);
            if (!builders || builders.length === 0) {
                throw new common_1.NotFoundException(`No builders found for owner ID ${ownerId}`);
            }
            return { data: builders, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const builder = await this.builderService.findOne(id);
            if (!builder) {
                throw new common_1.NotFoundException(`Builder with ID ${id} not found`);
            }
            return { data: builder, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateBuilderDto) {
        try {
            const updatedBuilder = await this.builderService.update(id, updateBuilderDto);
            if (!updatedBuilder) {
                throw new common_1.NotFoundException(`Builder with ID ${id} not found`);
            }
            return { data: updatedBuilder, message: 'updated successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async remove(id) {
        try {
            const deleted = await this.builderService.remove(id);
            if (!deleted) {
                throw new common_1.NotFoundException(`Builder with ID ${id} not found`);
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while deleting the builder.');
        }
    }
    async builderList() {
        try {
            const data = await this.builderService.BuilderList();
            if (!data || data.length === 0) {
                throw new common_1.NotFoundException('No builders found');
            }
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async getBuildersWithProjects() {
        try {
            const data = await this.builderService.getBuildersWithProjectCount();
            return { data, message: 'retrieved succeessfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async getBuilder(id) {
        try {
            const builder = await this.builderService.findOne(id);
            if (!builder) {
                throw new common_1.NotFoundException(`Builder with ID ${id} not found`);
            }
            const projects = await this.projectService.getProjectsByBuilder(id);
            return {
                data: { builder, projects: projects.data },
                message: 'retrieve successfully',
            };
        }
        catch (error) {
            throw error;
        }
    }
    async updateBuilder(req, updateBuilderDto) {
        const builderId = req.user._id;
        const data = await this.builderService.update(builderId, updateBuilderDto);
        if (!data) {
            throw new common_1.NotFoundException(`Builder with ID ${builderId} not found`);
        }
        return { data, message: 'Builder updated successfully' };
    }
    async findOneBuilder(req) {
        try {
            const id = req.user._id;
            const builder = await this.builderService.findOne(id);
            if (!builder) {
                throw new common_1.NotFoundException(`Builder with ID ${id} not found`);
            }
            return { data: builder, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.BuilderController = BuilderController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new builder' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Builder created successfully',
        type: builder_entity_1.Builder,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_builder_dto_1.CreateBuilderDto]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all builders with optional search, pagination, and sorting',
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
        description: 'Search term for filtering builders by name or email',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of builders retrieved successfully',
        type: [builder_entity_1.Builder],
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No builders found' }),
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
], BuilderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-owner'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('builder-jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve builders by owner ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Builders retrieved successfully',
        type: [builder_entity_1.Builder],
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No builders found for this owner' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "findByOwnerId", null);
__decorate([
    (0, common_1.Get)('builder/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a builder by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Builder retrieved successfully',
        type: builder_entity_1.Builder,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'id',
        type: String,
        required: true,
        description: 'Builder ID',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Builder not found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('builder/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a builder by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Builder updated successfully',
        type: builder_entity_1.Builder,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Builder not found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_builder_dto_1.UpdateBuilderDto]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('builder/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a builder by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Builder deleted successfully',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Builder not found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('builder-list'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all builders ',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of builders retrieved successfully',
        type: [builder_entity_1.Builder],
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No builders found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "builderList", null);
__decorate([
    (0, common_1.Get)('with-projects'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "getBuildersWithProjects", null);
__decorate([
    (0, common_1.Get)('builder-web/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a builder by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Builder retrieved successfully',
        type: builder_entity_1.Builder,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Builder not found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "getBuilder", null);
__decorate([
    (0, common_1.Patch)('update-builder'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('builder-jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Update a builder by builderId (owner only)' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The builder has been successfully updated',
        type: builder_entity_1.Builder,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Builder not found',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_builder_dto_1.UpdateBuilderDto]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "updateBuilder", null);
__decorate([
    (0, common_1.Get)('builder-profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a builder by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Builder retrieved successfully',
        type: builder_entity_1.Builder,
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('builder-jwt')),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Builder not found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "findOneBuilder", null);
exports.BuilderController = BuilderController = __decorate([
    (0, swagger_1.ApiTags)('Builders'),
    (0, common_1.Controller)('builders'),
    __metadata("design:paramtypes", [builder_service_1.BuilderService,
        project_service_1.ProjectService])
], BuilderController);
//# sourceMappingURL=builder.controller.js.map