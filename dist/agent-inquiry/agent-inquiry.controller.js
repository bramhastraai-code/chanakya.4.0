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
exports.AgentInquiryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agent_inquiry_service_1 = require("./agent-inquiry.service");
const create_agent_inquiry_dto_1 = require("./dto/create-agent-inquiry.dto");
const update_agent_inquiry_dto_1 = require("./dto/update-agent-inquiry.dto");
const agent_inquiry_entity_1 = require("./entities/agent-inquiry.entity");
const status_enum_1 = require("../common/enum/status.enum");
let AgentInquiryController = class AgentInquiryController {
    constructor(agentInquiryService) {
        this.agentInquiryService = agentInquiryService;
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder, searchQuery, status) {
        const data = await this.agentInquiryService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery, status);
        return { data, message: 'Agent inquiries retrieved successfully' };
    }
    async findOne(id) {
        const data = await this.agentInquiryService.findOne(id);
        return { data, message: 'Agent inquiry retrieved successfully' };
    }
    async create(createAgentInquiryDto) {
        const data = await this.agentInquiryService.create(createAgentInquiryDto);
        return { data, message: 'Agent inquiry created successfully' };
    }
    async update(id, updateAgentInquiryDto) {
        const data = await this.agentInquiryService.update(id, updateAgentInquiryDto);
        return { data, message: 'Agent inquiry updated successfully' };
    }
    async remove(id) {
        const data = await this.agentInquiryService.remove(id);
        return { data, message: 'Agent inquiry deleted successfully' };
    }
    async addAgentForm(createAgentInquiryDto) {
        try {
            const data = await this.agentInquiryService.addAgentForm(createAgentInquiryDto);
            return { data, message: 'Agent form added successfully' };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AgentInquiryController = AgentInquiryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a list of agent inquiries' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, description: 'Page size' }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Sort by field' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Sort order' }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        required: false,
        description: 'Search query',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter by status',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of agent inquiries' }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AgentInquiryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('agent-inquiry/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an agent inquiry by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Agent inquiry retrieved',
        type: agent_inquiry_entity_1.AgentInquiry,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inquiry not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentInquiryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new agent inquiry' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Inquiry created',
        type: agent_inquiry_entity_1.AgentInquiry,
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Phone number already in use' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agent_inquiry_dto_1.CreateAgentInquiryDto]),
    __metadata("design:returntype", Promise)
], AgentInquiryController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('agent-inquiry/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an agent inquiry by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inquiry updated',
        type: agent_inquiry_entity_1.AgentInquiry,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inquiry not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_agent_inquiry_dto_1.UpdateAgentInquiryDto]),
    __metadata("design:returntype", Promise)
], AgentInquiryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('agent-inquiry/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an agent inquiry by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inquiry deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inquiry not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentInquiryController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('add-agent-form'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new agent form' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Agent form added',
        type: agent_inquiry_entity_1.AgentInquiry,
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Phone number already in use' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agent_inquiry_dto_1.CreateAgentInquiryDto]),
    __metadata("design:returntype", Promise)
], AgentInquiryController.prototype, "addAgentForm", null);
exports.AgentInquiryController = AgentInquiryController = __decorate([
    (0, swagger_1.ApiTags)('agent-inquiries'),
    (0, common_1.Controller)('agent-inquiries'),
    __metadata("design:paramtypes", [agent_inquiry_service_1.AgentInquiryService])
], AgentInquiryController);
//# sourceMappingURL=agent-inquiry.controller.js.map