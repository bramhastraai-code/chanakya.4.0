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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_service_1 = require("./customer.service");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const customer_entity_1 = require("./entities/customer.entity");
const usertype_enum_1 = require("./enum/usertype.enum");
const passport_1 = require("@nestjs/passport");
let CustomerController = class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder, searchQuery, userType, status) {
        try {
            const data = await this.customerService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery, userType, status);
            return { data, message: 'created successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const data = await this.customerService.findOne(id);
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async create(createCustomerDto) {
        try {
            const data = await this.customerService.create(createCustomerDto);
            return { data, message: 'created successfully ' };
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateCustomerDto) {
        try {
            const data = await this.customerService.update(id, updateCustomerDto);
            return { data, message: 'updated successfully ' };
        }
        catch (error) {
            throw error;
        }
    }
    async remove(id) {
        try {
            return await this.customerService.remove(id);
        }
        catch (error) {
            throw error;
        }
    }
    async getAppliedProjects(customerId) {
        try {
            const data = await this.customerService.getAppliedProjects(customerId);
            return { data, message: 'retrieved successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async findCustomerProfile(req) {
        try {
            const id = req.user._id;
            const data = await this.customerService.findOne(id);
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async getCustomersByAgentWithPagination(req, page = 1, limit = 10) {
        try {
            const agentId = req.user._id;
            const data = await this.customerService.getCustomersByAgentWithPagination(agentId, page, limit);
            return { data, message: 'retrieved successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async createCustomerByAgent(req, createCustomerDto) {
        try {
            const agentId = req.user._id;
            const data = await this.customerService.createCustomerByAgent(agentId, createCustomerDto);
            return { data, message: 'created successfully by agent' };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a list of customers' }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        required: false,
        description: 'Number of customers per page',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Sort order' }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        required: false,
        description: 'Search query',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'userType',
        required: false,
        description: ' userType',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'status',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of customers' }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __param(5, (0, common_1.Query)('userType')),
    __param(6, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('customer/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a customer by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The customer', type: customer_entity_1.Customer }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new customer' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The customer has been created',
        type: customer_entity_1.Customer,
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already in use' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('customer/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a customer by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The customer has been updated',
        type: customer_entity_1.Customer,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('customer/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a customer by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The customer has been deleted',
        type: customer_entity_1.Customer,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('projects/:customerId'),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getAppliedProjects", null);
__decorate([
    (0, common_1.Get)('customer-profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the authenticated customer profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The customer', type: customer_entity_1.Customer }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findCustomerProfile", null);
__decorate([
    (0, common_1.Get)('by-agent'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get customers by assigned agent ID with pagination',
        description: 'Retrieve paginated list of customers assigned to a specific agent',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        description: 'Page number (default: 1)',
        required: false,
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: 'Number of items per page (default: 10)',
        required: false,
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of customers assigned to the agent',
        schema: {
            type: 'object',
            properties: {
                customers: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Customer' },
                },
                total: {
                    type: 'number',
                    description: 'Total number of customers for this agent',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No customers found for this agent',
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomersByAgentWithPagination", null);
__decorate([
    (0, common_1.Post)('by-agent'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Create a customer by agent' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Customer created by agent',
        type: customer_entity_1.Customer,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Email already in use',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "createCustomerByAgent", null);
exports.CustomerController = CustomerController = __decorate([
    (0, swagger_1.ApiTags)('customers'),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map