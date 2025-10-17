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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const order_service_1 = require("./order.service");
const order_entity_1 = require("./entities/order.entity");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async getOrders(pageSize, pageNumber, sortBy, sortOrder, searchQuery, status) {
        const data = await this.orderService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery, status);
        return { data, message: 'orders fetched successfully' };
    }
    async findOne(id) {
        try {
            const order = await this.orderService.findOne(id);
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${id} not found.`);
            }
            return { data: order, message: 'Order retrieved successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async createOrder(createOrderDto) {
        const { userId, amount, planId } = createOrderDto;
        const data = await this.orderService.createOrder(userId, amount, planId);
        return { data, message: 'order created successfully' };
    }
    async updateOrderStatus(orderId, updateStatusDto) {
        const { status, paymentDetails } = updateStatusDto;
        const data = await this.orderService.updateOrderStatus(orderId, status, paymentDetails);
        return { data, message: 'order status updated successfully' };
    }
    async getUserOrders(userId) {
        const data = await this.orderService.getUserOrders(userId);
        return { data, message: 'order fetch successfully ' };
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of orders' }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        description: 'Number of orders per page',
        required: true,
        example: '10',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageNumber',
        description: 'Page number to fetch',
        required: true,
        example: '1',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        description: 'Field to sort by (default: createdAt)',
        required: false,
        example: 'createdAt',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        description: 'Sort order (asc or desc)',
        required: false,
        example: 'asc',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        description: 'Search query to filter orders by userId, receipt, or orderId',
        required: false,
        example: 'receipt_12345',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        description: 'Filter orders by status (pending, success, failed)',
        required: false,
        example: 'pending',
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
], OrderController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The order details', type: order_entity_1.Order }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update the status of an order' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order status updated successfully.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found.' }),
    (0, common_1.Put)(':orderId/status'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateOrderStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders of a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders fetched successfully.' }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found or no orders available.',
    }),
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getUserOrders", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map