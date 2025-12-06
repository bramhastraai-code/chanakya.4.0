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
exports.InquiryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inquiry_service_1 = require("./inquiry.service");
const inquiry_entity_1 = require("./entities/inquiry.entity");
const create_inquiry_dto_1 = require("./dto/create-inquiry.dto");
const update_inquiry_dto_1 = require("./dto/update-inquiry.dto");
let InquiryController = class InquiryController {
    constructor(inquiryService) {
        this.inquiryService = inquiryService;
    }
    async create(createInquiryDto) {
        try {
            const data = await this.inquiryService.create(createInquiryDto);
            return { data, message: 'Inquiry created successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateInquiryDto) {
        try {
            const updatedInquiry = await this.inquiryService.update(id, updateInquiryDto);
            if (!updatedInquiry) {
                throw new common_1.NotFoundException('Inquiry not found');
            }
            return updatedInquiry;
        }
        catch (error) {
            throw error;
        }
    }
    async findAll(pageSize = '10', pageNumber = '1', sortBy = 'createdAt', sortOrder = 'desc', searchQuery, inquiryType, status, projectId, propertyId, builderId) {
        try {
            const data = await this.inquiryService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery, inquiryType, status, projectId, propertyId, builderId);
            return { data, message: 'Retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const inquiry = await this.inquiryService.findOne(id);
            if (!inquiry) {
                throw new common_1.NotFoundException('Inquiry not found');
            }
            return { data: inquiry, message: 'Retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async remove(id) {
        try {
            const result = await this.inquiryService.remove(id);
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Inquiry not found');
            }
            return { data: 'DELETE successfully', message: 'delete successful' };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.InquiryController = InquiryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new inquiry' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Inquiry created successfully',
        type: inquiry_entity_1.Inquiry,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inquiry_dto_1.CreateInquiryDto]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('inquiry/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing inquiry' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Inquiry updated successfully',
        type: inquiry_entity_1.Inquiry,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Inquiry not found',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inquiry_dto_1.UpdateInquiryDto]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all inquiries with pagination, sorting, search, inquiryType, and status filter',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        type: Number,
        required: false,
        description: 'Number of inquiries per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageNumber',
        type: Number,
        required: false,
        description: 'Page number to retrieve',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        type: String,
        required: false,
        enum: ['createdAt', 'updatedAt', 'status'],
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
        description: 'Search term for filtering inquiries',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'inquiryType',
        type: String,
        required: false,
        enum: ['common', 'groupBuy', 'agentSelection', 'quickBuy', 'siteVisit'],
        description: 'Filter by inquiry type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        type: String,
        required: false,
        enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        description: 'Filter by inquiry status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'projectId',
        type: String,
        required: false,
        description: 'Filter inquiries by project ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'propertyId',
        type: String,
        required: false,
        description: 'Filter inquiries by property ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'builderId',
        type: String,
        required: false,
        description: 'Filter inquiries by builder ID (via project/property)',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of inquiries retrieved successfully',
        type: [inquiry_entity_1.Inquiry],
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __param(5, (0, common_1.Query)('inquiryType')),
    __param(6, (0, common_1.Query)('status')),
    __param(7, (0, common_1.Query)('projectId')),
    __param(8, (0, common_1.Query)('propertyId')),
    __param(9, (0, common_1.Query)('builderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('inquiry/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a single inquiry by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The inquiry details',
        type: inquiry_entity_1.Inquiry,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Inquiry not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)('inquiry/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an inquiry by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Inquiry deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Inquiry not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "remove", null);
exports.InquiryController = InquiryController = __decorate([
    (0, swagger_1.ApiTags)('inquiries'),
    (0, common_1.Controller)('inquiries'),
    __metadata("design:paramtypes", [inquiry_service_1.InquiryService])
], InquiryController);
//# sourceMappingURL=inquiry.controller.js.map