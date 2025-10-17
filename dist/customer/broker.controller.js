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
exports.BrokerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const broker_response_dto_1 = require("./dto/broker-response.dto");
const broker_service_1 = require("./broker.service");
const customer_entity_1 = require("./entities/customer.entity");
const passport_1 = require("@nestjs/passport");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const update_lead_status_tdo_1 = require("./dto/update-lead.status.tdo");
const handleConnection_dto_1 = require("./dto/handleConnection.dto");
let BrokerController = class BrokerController {
    constructor(brokerService) {
        this.brokerService = brokerService;
    }
    async getBrokersWithPerformance() {
        const data = await this.brokerService.getAllBrokersWithPerformance();
        return { data, message: 'Brokers fetched successfully' };
    }
    async getByServiceArea(area) {
        const data = await this.brokerService.findByServiceArea(area);
        return { data, message: 'Customers fetched successfully' };
    }
    async getByServiceAreas(areas) {
        const areasArray = areas.split(',');
        const data = await this.brokerService.findByServiceAreas(areasArray);
        return { data, message: 'Customers fetched successfully' };
    }
    async findByAssignedAgent(req) {
        try {
            const id = req.user._id;
            const data = await this.brokerService.findByAssignedAgent(id);
            return { data, message: 'Customers fetched successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async requestBroker(body, brokerId) {
        const data = await this.brokerService.handleBrokerRequest(body.customerId, brokerId, body.area);
        return { data, message: 'Request sent successfully' };
    }
    async acceptRequest(customerId, body) {
        const data = await this.brokerService.acceptRequest(body.brokerId, customerId);
        return { data, message: 'Request accepted successfully' };
    }
    async manualAssign(customerId, body) {
        const data = await this.brokerService.manuallyAssignBroker(body.adminId, customerId, body.brokerId);
        return { data, message: 'Broker manually assigned' };
    }
    async update(req, updateCustomerDto) {
        const id = req.user._id;
        const data = await this.brokerService.updateBroker(id, updateCustomerDto);
        return { data, message: 'Customer updated successfully' };
    }
    async getBrokerById(req) {
        try {
            const id = req.user._id;
            const broker = await this.brokerService.getBrokerById(id);
            return { data: broker, message: 'Broker retrieved successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async updateLeadStatus(customerId, updateLeadStatusDto, req) {
        const updatedBy = req.user._id;
        const data = await this.brokerService.updateLeadStatus(customerId, updateLeadStatusDto, updatedBy);
        return { data, message: 'Lead status updated successfully' };
    }
    async sendBrokerConnectionRequest(req, brokerId) {
        const customerId = req.user._id;
        const data = await this.brokerService.sendBrokerConnectionRequest(customerId, brokerId);
        return { data, message: 'Connection request sent successfully' };
    }
    async handleBrokerConnectionRequest(customerId, req, handleConnectionDto) {
        const brokerId = req.user._id;
        const data = await this.brokerService.handleBrokerConnectionRequest(customerId, brokerId, handleConnectionDto.action, handleConnectionDto.brokerName);
        return { data, message: 'Connection request handled successfully' };
    }
    async sendBrokerConnectionRequesTestt(customerId, brokerId) {
        const data = await this.brokerService.sendBrokerConnectionRequest(customerId, brokerId);
        return { data, message: 'Connection request sent successfully' };
    }
};
exports.BrokerController = BrokerController;
__decorate([
    (0, common_1.Get)('/brokers-with-performance'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all brokers with performance metrics',
        description: `
      Returns all registered agents/brokers with their complete profile information
      and calculated performance scores. The performance score is calculated based on:
      - Rating (40% weight)
      - Closed deals (30% weight)
      - Review count (20% weight)
      - Years of experience (10% weight)
      
      Includes all agent-specific properties:
      - Contact information
      - Service areas
      - Verification status
      - License details
      - Agency information (if applicable)
      - Performance metrics
    `,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved list of brokers with performance data',
        schema: {
            type: 'array',
            items: {
                $ref: (0, swagger_1.getSchemaPath)(broker_response_dto_1.BrokerResponseDto),
            },
            example: [
                {
                    _id: '507f1f77bcf86cd799439011',
                    name: 'John Doe',
                    userImage: 'https://example.com/profile.jpg',
                    email: 'john.doe@example.com',
                    userType: 'Agent',
                    responseTime: '1 day',
                    serviceAreas: ['New York', 'Boston'],
                    verificationStatus: 'Verified',
                    verificationDocuments: ['doc1.pdf', 'doc2.pdf'],
                    licenseNumber: 'LIC123456',
                    licenseExpiry: '2025-12-31T00:00:00.000Z',
                    yearsOfExperience: 5,
                    agencyName: 'Prime Real Estate',
                    agencyLicense: 'AGENCY123',
                    agencyFoundedYear: 2010,
                    teamSize: 10,
                    rating: 4.5,
                    reviewCount: 25,
                    closedDeals: 50,
                    performanceScore: 4.25,
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "getBrokersWithPerformance", null);
__decorate([
    (0, common_1.Get)('by-service-area'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customers by service area' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customers retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Query)('area')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "getByServiceArea", null);
__decorate([
    (0, common_1.Get)('by-service-areas'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customers by multiple service areas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customers retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Query)('areas')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "getByServiceAreas", null);
__decorate([
    (0, common_1.Get)('by-assigned-agent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customers assigned to a specific agent' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customers retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "findByAssignedAgent", null);
__decorate([
    (0, common_1.Post)('request/:brokerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Request connection with a specific broker' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request initiated successfully' }),
    (0, swagger_1.ApiBody)({
        description: 'Request payload containing customer ID and area',
        schema: {
            type: 'object',
            properties: {
                customerId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                area: { type: 'string', example: 'New York' },
            },
            required: ['customerId', 'area'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('brokerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "requestBroker", null);
__decorate([
    (0, common_1.Post)('accept/:customerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Broker accepts a customer request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Broker assigned successfully' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "acceptRequest", null);
__decorate([
    (0, common_1.Post)('manual-assign/:customerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin manually assigns a broker' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Broker manually assigned' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "manualAssign", null);
__decorate([
    (0, common_1.Patch)('update-broker'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Update a customer by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The customer has been updated',
        type: customer_entity_1.Customer,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('get-broker'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Get broker by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Broker retrieved successfully',
        type: customer_entity_1.Customer,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid ID format' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Broker not found' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "getBrokerById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update lead status',
        description: 'Update the status of a lead/customer',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID of the customer/lead to update',
        type: String,
    }),
    (0, swagger_1.ApiBody)({ type: update_lead_status_tdo_1.UpdateLeadStatusDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lead status updated successfully',
        type: customer_entity_1.Customer,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User not authorized to update this lead',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Lead not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lead_status_tdo_1.UpdateLeadStatusDto, Object]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "updateLeadStatus", null);
__decorate([
    (0, common_1.Post)('request-connection/:brokerId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send connection request to broker',
        description: 'Allows a customer to send a connection request to a broker',
    }),
    (0, swagger_1.ApiParam)({
        name: 'brokerId',
        description: 'ID of the broker receiving the request',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Connection request sent successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request parameters' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer or broker not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('brokerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "sendBrokerConnectionRequest", null);
__decorate([
    (0, common_1.Post)(':customerId/handle-connection'),
    (0, swagger_1.ApiOperation)({
        summary: 'Handle broker connection request',
        description: 'Allows broker to accept or reject a connection request',
    }),
    (0, swagger_1.ApiParam)({
        name: 'customerId',
        description: 'ID of the customer who sent the request',
        type: String,
    }),
    (0, swagger_1.ApiBody)({ type: handleConnection_dto_1.HandleBrokerConnectionDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Connection request handled successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Customer already connected with another broker',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, handleConnection_dto_1.HandleBrokerConnectionDto]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "handleBrokerConnectionRequest", null);
__decorate([
    (0, common_1.Post)('request-test/:brokerId/:customerId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send connection request to broker',
        description: 'Allows a customer to send a connection request to a broker',
    }),
    (0, swagger_1.ApiParam)({
        name: 'brokerId',
        description: 'ID of the broker receiving the request',
        type: String,
    }),
    (0, swagger_1.ApiParam)({
        name: 'customerId',
        description: 'ID of the broker receiving the request',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Connection request sent successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request parameters' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer or broker not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Param)('brokerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrokerController.prototype, "sendBrokerConnectionRequesTestt", null);
exports.BrokerController = BrokerController = __decorate([
    (0, swagger_1.ApiTags)('Brokers'),
    (0, common_1.Controller)('brokers'),
    (0, swagger_1.ApiExtraModels)(broker_response_dto_1.BrokerResponseDto),
    __metadata("design:paramtypes", [broker_service_1.BrokerService])
], BrokerController);
//# sourceMappingURL=broker.controller.js.map