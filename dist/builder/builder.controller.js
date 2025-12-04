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
exports.BuilderAdminController = exports.BuilderController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const builder_service_1 = require("./builder.service");
const agent_builder_association_service_1 = require("../agent/services/agent-builder-association.service");
const create_builder_dto_1 = require("./dto/create-builder.dto");
const update_builder_dto_1 = require("./dto/update-builder.dto");
const add_agent_dto_1 = require("./dto/add-agent.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../core/guards/jwt.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enum/user-role.enum");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const s3_service_1 = require("../s3/s3.service");
let BuilderController = class BuilderController {
    constructor(builderService, s3Service, associationService) {
        this.builderService = builderService;
        this.s3Service = s3Service;
        this.associationService = associationService;
    }
    async getProfile(user) {
        const data = await this.builderService.getProfile(user.userId);
        return { data, message: 'Profile retrieved successfully' };
    }
    async updateProfile(user, dto) {
        const data = await this.builderService.updateProfile(user.userId, dto);
        return { data, message: 'Profile updated successfully' };
    }
    async updateSocialLinks(user, dto) {
        const data = await this.builderService.updateSocialLinks(user.userId, dto);
        return { data, message: 'Social links updated successfully' };
    }
    async uploadLogo(user, file) {
        const imageResult = await this.s3Service.uploadFile(file, 'builder-logos');
        const data = await this.builderService.updateCompanyLogo(user.userId, imageResult.url);
        return { data, message: 'Logo uploaded successfully' };
    }
    async getStatistics(user) {
        const data = await this.builderService.getStatistics(user.userId);
        return { data, message: 'Statistics retrieved successfully' };
    }
    async addAgent(user, body) {
        const data = await this.associationService.createAssociation(body.agentId, user.userId, body.projectId, user.userId);
        return {
            data,
            message: 'Agent added to project successfully',
        };
    }
    async bulkAddAgents(user, body) {
        const data = await this.associationService.bulkCreateAssociations(body.agentIds, user.userId, body.projectId, user.userId);
        return {
            data,
            message: 'Agents added to project successfully',
        };
    }
    async getBuilderAgents(user, projectId) {
        const data = await this.associationService.getBuilderAgents(user.userId, projectId);
        return {
            data,
            message: 'Agents retrieved successfully',
        };
    }
    async getProjectAgents(user, projectId) {
        const data = await this.associationService.getProjectAgents(projectId);
        return {
            data,
            message: 'Project agents retrieved successfully',
        };
    }
    async removeAgent(user, associationId) {
        const data = await this.associationService.removeAssociationById(associationId);
        return {
            data,
            message: 'Agent removed from project successfully',
        };
    }
    async getBuilderRequirements(user, page, limit, status) {
        return {
            data: {
                message: 'Requirements endpoint - integrate with RequirementService.findAllForBuilder',
            },
            message: 'Requirements retrieved successfully',
        };
    }
    async getBuilderLeads(user, page, limit, status) {
        return {
            data: {
                message: 'Leads endpoint - integrate with LeadService.findAllForBuilder',
            },
            message: 'Leads retrieved successfully',
        };
    }
};
exports.BuilderController = BuilderController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get builder profile',
        description: 'Retrieve complete profile information of the authenticated builder including company details',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({
        summary: 'Update builder profile',
        description: 'Update builder company information including name, description, location, and contact details',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('profile/social-links'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({ summary: 'Update social media links' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "updateSocialLinks", null);
__decorate([
    (0, common_1.Post)('profile/logo'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload company logo',
        description: 'Upload or update the builder company logo image. Accepts image files (JPG, PNG)',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logo uploaded successfully' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "uploadLogo", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get builder statistics',
        description: 'Retrieve comprehensive statistics including projects, properties, agents, leads, and sales data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Post)('agents'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({
        summary: 'Add agent to builder project',
        description: 'Associate an agent with a specific project to give them access to project details, leads, and offers',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Agent added successfully to project',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agent or project not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_agent_dto_1.AddAgentDto]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "addAgent", null);
__decorate([
    (0, common_1.Post)('agents/bulk'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({
        summary: 'Add multiple agents to project',
        description: 'Bulk associate multiple agents with a project in one operation',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'All agents added successfully to project',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid agent IDs or project ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_agent_dto_1.BulkAddAgentsDto]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "bulkAddAgents", null);
__decorate([
    (0, common_1.Get)('agents'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all agents working with builder',
        description: 'Retrieve list of all agents associated with builder across all projects or filter by specific project',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'projectId',
        required: false,
        description: 'Filter agents by specific project ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Agents list retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "getBuilderAgents", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/agents'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({ summary: 'Get agents for specific project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project agents retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "getProjectAgents", null);
__decorate([
    (0, common_1.Delete)('agents/:associationId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({ summary: 'Remove agent from project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent removed successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('associationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "removeAgent", null);
__decorate([
    (0, common_1.Get)('requirements'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get requirements for builder projects',
        description: 'Retrieve buyer requirements related to builder projects with pagination and status filtering',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        type: String,
        description: 'Filter by requirement status',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Requirements retrieved successfully with pagination',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "getBuilderRequirements", null);
__decorate([
    (0, common_1.Get)('leads'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUILDER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get leads for builder projects',
        description: 'Retrieve all leads generated for builder projects with pagination and status filtering',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        type: String,
        description: 'Filter by lead status',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leads retrieved successfully with pagination',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], BuilderController.prototype, "getBuilderLeads", null);
exports.BuilderController = BuilderController = __decorate([
    (0, swagger_1.ApiTags)('Builder'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('builder'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [builder_service_1.BuilderService,
        s3_service_1.S3Service,
        agent_builder_association_service_1.AgentBuilderAssociationService])
], BuilderController);
let BuilderAdminController = class BuilderAdminController {
    constructor(builderService) {
        this.builderService = builderService;
    }
    create(createBuilderDto) {
        return this.builderService.create(createBuilderDto);
    }
    findAll(page = 1, limit = 10, search, sort, order, isActive) {
        return this.builderService.findAll(page, limit, search, sort, order, isActive !== undefined ? { isActive } : undefined);
    }
    findOne(id) {
        return this.builderService.findOne(id);
    }
    update(id, updateBuilderDto) {
        return this.builderService.update(id, updateBuilderDto);
    }
    remove(id) {
        return this.builderService.remove(id);
    }
    async getBuilderProperties(id, page = 1, limit = 10) {
        const data = await this.builderService.getBuilderProperties(id, page, limit);
        return {
            data,
            message: 'Builder properties retrieved successfully',
        };
    }
    async getBuilderProjects(id, page = 1, limit = 10) {
        const data = await this.builderService.getBuilderProjects(id, page, limit);
        return {
            data,
            message: 'Builder projects retrieved successfully',
        };
    }
    async getBuilderInquiries(id, page = 1, limit = 10) {
        const data = await this.builderService.getBuilderInquiries(id, page, limit);
        return {
            data,
            message: 'Builder inquiries retrieved successfully',
        };
    }
    async getBuilderBounties(id, page = 1, limit = 10) {
        const data = await this.builderService.getBuilderBounties(id, page, limit);
        return {
            data,
            message: 'Builder bounties retrieved successfully',
        };
    }
};
exports.BuilderAdminController = BuilderAdminController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new builder',
        description: 'Admin creates a new builder/developer account in the system',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Builder created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_builder_dto_1.CreateBuilderDto]),
    __metadata("design:returntype", void 0)
], BuilderAdminController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all builders with pagination and filters',
        description: 'Retrieve complete list of builders with advanced filtering, sorting, and search capabilities',
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
        description: 'Items per page (default: 10)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        description: 'Search by company name or email',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sort',
        required: false,
        type: String,
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'order',
        required: false,
        enum: ['asc', 'desc'],
        description: 'Sort order',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        type: Boolean,
        description: 'Filter by active status',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Builders retrieved successfully with pagination',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sort')),
    __param(4, (0, common_1.Query)('order')),
    __param(5, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Boolean]),
    __metadata("design:returntype", void 0)
], BuilderAdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('builder/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get a builder by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BuilderAdminController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('builder/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a builder' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_builder_dto_1.UpdateBuilderDto]),
    __metadata("design:returntype", void 0)
], BuilderAdminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('builder/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a builder' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BuilderAdminController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('builder/:id/properties'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all properties by builder ID',
        description: 'Retrieve all properties listed by a specific builder with pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Builder properties retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], BuilderAdminController.prototype, "getBuilderProperties", null);
__decorate([
    (0, common_1.Get)('builder/:id/projects'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all projects by builder ID',
        description: 'Retrieve all projects/developments created by a specific builder with pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Builder projects retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], BuilderAdminController.prototype, "getBuilderProjects", null);
__decorate([
    (0, common_1.Get)('builder/:id/inquiries'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all inquiries for builder properties/projects',
        description: 'Retrieve all customer inquiries received for properties and projects belonging to the builder',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Builder inquiries retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], BuilderAdminController.prototype, "getBuilderInquiries", null);
__decorate([
    (0, common_1.Get)('builder/:id/bounties'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all bounties for builder projects',
        description: 'Retrieve all bounty/reward programs created by the builder for their projects',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Builder bounties retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], BuilderAdminController.prototype, "getBuilderBounties", null);
exports.BuilderAdminController = BuilderAdminController = __decorate([
    (0, swagger_1.ApiTags)('Builder by Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('builder-by-admin'),
    (0, common_1.UseGuards)(jwt_guard_1.jwtGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [builder_service_1.BuilderService])
], BuilderAdminController);
//# sourceMappingURL=builder.controller.js.map