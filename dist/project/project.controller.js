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
var ProjectController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
const project_service_1 = require("./project.service");
const project_entity_1 = require("./entities/project.entity");
const create_project_dto_1 = require("./dto/create-project.dto");
const project_enum_1 = require("./enum/project.enum");
const common_2 = require("@nestjs/common");
const ProjectCategory_dto_1 = require("./dto/ProjectCategory.dto");
const featuredProject_dto_1 = require("./dto/featuredProject.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const project_detail_dto_1 = require("./dto/project-detail.dto");
const status_enum_1 = require("../common/enum/status.enum");
const jwt_guard_1 = require("../core/guards/jwt.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enum/user-role.enum");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ProjectController = ProjectController_1 = class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
        this.logger = new common_2.Logger(ProjectController_1.name);
    }
    async create(createProjectDto, user) {
        const userObjectId = new mongoose_1.Types.ObjectId(user.userId);
        createProjectDto.createdBy = userObjectId.toString();
        createProjectDto.updatedBy = userObjectId.toString();
        if (user.role === user_role_enum_1.UserRole.BUILDER) {
            createProjectDto.builder = userObjectId.toString();
        }
        const data = await this.projectService.create(createProjectDto);
        return { data, message: 'created successfully' };
    }
    async getProjectsByCreator(user, pageSize, pageNumber, searchQuery, status) {
        const data = await this.projectService.findProjectsByCreator(user.userId, pageSize, pageNumber, searchQuery, status);
        return { data, message: 'Projects retrieved successfully' };
    }
    async getProjectsWithActiveBounties() {
        const projects = await this.projectService.findProjectsWithActiveBounties();
        return {
            data: projects,
            message: 'Projects with active bounties retrieved successfully.',
        };
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery, status) {
        try {
            const data = await this.projectService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery, status);
            return { data, message: 'project retrive sucessfullly' };
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        return {
            data: await this.projectService.findOne(id),
            message: 'retrieve successfully',
        };
    }
    async update(id, updateProjectDto, user) {
        const userObjectId = new mongoose_1.Types.ObjectId(user.userId);
        updateProjectDto.updatedBy = userObjectId.toString();
        if (user.role === user_role_enum_1.UserRole.BUILDER) {
            updateProjectDto.builder = userObjectId.toString();
        }
        const data = await this.projectService.update(id, updateProjectDto);
        return { data, message: 'updated successfully' };
    }
    async remove(id) {
        const data = await this.projectService.remove(id);
        return { data, message: 'delete successfully' };
    }
    async projectList() {
        try {
            const data = await this.projectService.ProjectList();
            if (!data || data.length === 0) {
                throw new common_1.NotFoundException('No builders found');
            }
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async getProjectsByCategory(getProjectByCategoryDto) {
        const { category } = getProjectByCategoryDto;
        const data = await this.projectService.getProjectsByCategory(category);
        return { data, message: 'retrieve successfully' };
    }
    async getProjectsByAffordability(getProjectByAffordabilityDto) {
        const { affordability, city } = getProjectByAffordabilityDto;
        this.logger.log(`Getting projects by affordability: ${affordability}, city: ${city}`);
        const data = await this.projectService.getProjectsByAffordability(affordability, city);
        this.logger.log(`Retrieved ${data.length} projects`);
        return { data, message: 'retrieve successfully' };
    }
    async getProjectDetail(id) {
        const data = await this.projectService.getProjectDetail(id);
        return { data, message: 'retrieve successfully' };
    }
    async getProjectsByCity(city) {
        const data = await this.projectService.getProjectsByCity(city);
        return { data, message: 'retrieve successfully' };
    }
    async getFormattedProjects() {
        const data = await this.projectService.getFormattedProjects();
        return { data, message: 'retrieved successfully' };
    }
    async getUniqueCities() {
        try {
            const data = await this.projectService.getUniqueCities();
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async getCityPropertyCount() {
        const data = await this.projectService.getCityPropertyCount();
        return { data, message: 'retried successfully' };
    }
    async getProjectsByBuilder(builderId) {
        return this.projectService.getProjectsByBuilder(builderId);
    }
    async getProjectsGroupedByBuilder() {
        return this.projectService.getProjectsGroupedByBuilder();
    }
    async searchProjects(keyword) {
        if (!keyword || keyword.trim() === '') {
            throw new common_1.HttpException('Keyword is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const data = await this.projectService.searchProjects(keyword);
        return { data, message: 'retrieved successfully' };
    }
    async createBuilderProject(createProjectDto, user) {
        const userObjectId = new mongoose_1.Types.ObjectId(user.userId);
        createProjectDto.createdBy = userObjectId.toString();
        createProjectDto.updatedBy = userObjectId.toString();
        if (user.role === user_role_enum_1.UserRole.BUILDER) {
            createProjectDto.builder = userObjectId.toString();
        }
        const data = await this.projectService.create(createProjectDto);
        return { data, message: 'Project created successfully' };
    }
    async getProjectsByBuilderId(builderId) {
        try {
            const data = await this.projectService.getBuilderProjects(builderId);
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async updateProject(projectId, updateProjectDto, user) {
        const userObjectId = new mongoose_1.Types.ObjectId(user.userId);
        updateProjectDto.updatedBy = userObjectId.toString();
        if (user.role === user_role_enum_1.UserRole.BUILDER) {
            updateProjectDto.builder = userObjectId.toString();
        }
        const data = await this.projectService.update(projectId, updateProjectDto);
        return { data, message: 'Project updated successfully' };
    }
    async deleteProject(projectId) {
        const data = await this.projectService.remove(projectId);
        return { data, message: 'Project deleted successfully' };
    }
    async getPublicProjects(pageSize = '20', pageNumber = '1', city, category) {
        const data = await this.projectService.findAll(pageSize, pageNumber, 'createdAt', 'desc', `${city}+${category ? ` ${category}` : ''}`, status_enum_1.Status.ACTIVE);
        return { data, message: 'Public projects retrieved successfully' };
    }
};
exports.ProjectController = ProjectController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER, user_role_enum_1.UserRole.AGENT, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new project (requires builder/agent/admin role)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The project has been successfully created.',
        type: project_entity_1.Project,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden - insufficient permissions',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('by-creator'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get projects by creator (JWT) with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'searchQuery', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: false }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Projects created by the authenticated user',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('pageNumber')),
    __param(3, (0, common_1.Query)('searchQuery')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectsByCreator", null);
__decorate([
    (0, common_1.Get)('active-bounties'),
    (0, swagger_1.ApiOperation)({ summary: 'Get projects with active bounties' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Projects with active bounties retrieved successfully.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectsWithActiveBounties", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all projects with pagination, sorting, and searching',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        required: true,
        type: String,
        description: 'Number of projects per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageNumber',
        required: true,
        type: String,
        description: 'Current page number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        type: String,
        description: 'Field to sort by',
        example: 'createdAt',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        required: false,
        type: String,
        description: 'Sort order',
        enum: ['asc', 'desc'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        required: false,
        type: String,
        description: 'Search query for filtering projects',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: status_enum_1.Status,
        description: 'Filter projects by status',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The list of projects with pagination, sorting, and searching',
        schema: {
            example: {
                properties: [
                    {
                        id: '60d0fe4f5311236168a109ca',
                        projectName: 'Project A',
                        projectThumbnail: 'http://example.com/thumbnail.jpg',
                        createdAt: '2024-08-26T12:00:00Z',
                        updatedAt: '2024-08-26T12:00:00Z',
                    },
                ],
                totalPages: 10,
                totalProjects: 100,
                pageSize: 10,
                pageNumber: 1,
            },
        },
    }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('project/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a single project by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Project ID',
        example: '60d0fe4f5311236168a109ca',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The project found',
        type: project_entity_1.Project,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Project not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('project/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER, user_role_enum_1.UserRole.AGENT, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a project by ID (requires builder/agent/admin role)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Project ID',
        example: '60d0fe4f5311236168a109ca',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The project has been successfully updated',
        type: project_entity_1.Project,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Project not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden - insufficient permissions',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('project/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER, user_role_enum_1.UserRole.AGENT, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a project by ID (requires builder/agent/admin role)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Project ID',
        example: '60d0fe4f5311236168a109ca',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The project has been successfully deleted',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Project not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('project-list'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all builders ',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of builders retrieved successfully',
        type: [project_entity_1.Project],
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No Project found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "projectList", null);
__decorate([
    (0, common_1.Get)('by-category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get projects by category' }),
    (0, swagger_1.ApiQuery)({ name: 'category', enum: project_enum_1.ProjectCategory, required: false }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of active projects.',
        type: [featuredProject_dto_1.FeaturedProjectDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProjectCategory_dto_1.GetProjectByCategoryDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectsByCategory", null);
__decorate([
    (0, common_1.Get)('by-affordability'),
    (0, swagger_1.ApiOperation)({ summary: 'Get projects by category' }),
    (0, swagger_1.ApiQuery)({
        name: 'affordability',
        enum: project_enum_1.ProjectAffordability,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'city',
        type: String,
        required: false,
        description: 'city name',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of active projects.',
        type: [featuredProject_dto_1.FeaturedProjectDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProjectCategory_dto_1.GetProjectByAffordabilityDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectsByAffordability", null);
__decorate([
    (0, common_1.Get)('project-detail/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get project details by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the details of the project',
        type: project_detail_dto_1.ProjectDetailDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Project not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectDetail", null);
__decorate([
    (0, common_1.Get)('by-city/:city'),
    (0, swagger_1.ApiOperation)({ summary: 'Get projects by city' }),
    (0, swagger_1.ApiParam)({
        name: 'city',
        required: true,
        description: 'Name of the city to filter projects by',
        example: 'Mumbai',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of projects in the specified city',
        type: [project_entity_1.Project],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No projects found in the specified city',
    }),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectsByCity", null);
__decorate([
    (0, common_1.Get)('project-region-wise'),
    (0, swagger_1.ApiOperation)({ summary: 'Get projects grouped by city and region' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns projects grouped by city and region',
        type: [Object],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getFormattedProjects", null);
__decorate([
    (0, common_1.Get)('unique-cities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unique cities' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of unique cities',
        type: [String],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getUniqueCities", null);
__decorate([
    (0, common_1.Get)('project-count-by-city'),
    (0, swagger_1.ApiOperation)({ summary: 'Get property count by city' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The property count by city has been successfully retrieved.',
        schema: {
            example: [
                { city: 'Mumbai', propertyCount: 120 },
                { city: 'Delhi', propertyCount: 95 },
                { city: 'Bangalore', propertyCount: 75 },
            ],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getCityPropertyCount", null);
__decorate([
    (0, common_1.Get)('builder/:builderId'),
    __param(0, (0, common_1.Param)('builderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectsByBuilder", null);
__decorate([
    (0, common_1.Get)('grouped-by-builder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectsGroupedByBuilder", null);
__decorate([
    (0, common_1.Get)('get-project-suggestions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Search projects by keyword',
        description: 'Search for projects and return their title and id.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'keyword', required: true, description: 'Search keyword' }),
    __param(0, (0, common_1.Query)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "searchProjects", null);
__decorate([
    (0, common_1.Post)('builder-projects'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER, user_role_enum_1.UserRole.AGENT, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new project (requires builder/agent/admin role)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The project has been successfully created.',
        type: project_entity_1.Project,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden - insufficient permissions',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "createBuilderProject", null);
__decorate([
    (0, common_1.Get)('builder-projects/:builderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get projects by builder ID' }),
    (0, swagger_1.ApiParam)({
        name: 'builderId',
        required: true,
        description: 'ID of the builder to filter projects by',
        example: '60d0fe4f5311236168a109ca',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of projects for the specified builder',
        type: [project_entity_1.Project],
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'No projects found for the specified builder',
    }),
    __param(0, (0, common_1.Param)('builderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectsByBuilderId", null);
__decorate([
    (0, common_1.Patch)('builder-projects/:projectId'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER, user_role_enum_1.UserRole.AGENT, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a project by projectId (requires builder/agent/admin role)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'projectId',
        required: true,
        description: 'ID of the project to update',
        example: '60d0fe4f5311236168a109ca',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The project has been successfully updated',
        type: project_entity_1.Project,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Project not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden - insufficient permissions',
    }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Delete)('builder-projects/:projectId'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER, user_role_enum_1.UserRole.AGENT, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a project by projectId (requires builder/agent/admin role)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'projectId',
        required: true,
        description: 'ID of the project to delete',
        example: '60d0fe4f5311236168a109ca',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The project has been successfully deleted',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Project not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "deleteProject", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all active projects for public/website access (no auth required)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        required: false,
        type: String,
        description: 'Number of projects per page',
        example: '20',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageNumber',
        required: false,
        type: String,
        description: 'Current page number',
        example: '1',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'city',
        required: false,
        type: String,
        description: 'Filter by city',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        enum: project_enum_1.ProjectCategory,
        description: 'Filter by category',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of active projects for public access',
        type: [project_entity_1.Project],
    }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('city')),
    __param(3, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getPublicProjects", null);
exports.ProjectController = ProjectController = ProjectController_1 = __decorate([
    (0, swagger_1.ApiTags)('projects'),
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
//# sourceMappingURL=project.controller.js.map