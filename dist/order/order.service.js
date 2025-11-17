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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_entity_1 = require("./entities/order.entity");
const nestjs_razorpay_1 = require("nestjs-razorpay");
const razorpay_1 = require("razorpay");
let OrderService = class OrderService {
    constructor(orderModel, razorpay) {
        this.orderModel = orderModel;
        this.razorpay = razorpay;
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery, status) {
        try {
            const limit = parseInt(pageSize, 10);
            const skip = (parseInt(pageNumber, 10) - 1) * limit;
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
            const searchFilter = searchQuery
                ? {
                    $or: [
                        { userId: { $regex: searchQuery, $options: 'i' } },
                        { receipt: { $regex: searchQuery, $options: 'i' } },
                        { orderId: { $regex: searchQuery, $options: 'i' } },
                    ],
                }
                : {};
            if (status && status !== 'all') {
                searchFilter.status = status;
            }
            const totalOrders = await this.orderModel
                .countDocuments(searchFilter)
                .exec();
            const orders = await this.orderModel
                .find(searchFilter)
                .populate('userId')
                .populate('planId')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec();
            const totalPages = Math.ceil(totalOrders / limit);
            return {
                orders,
                totalPages,
                totalOrders,
                pageSize: limit,
                pageNumber: parseInt(pageNumber, 10),
            };
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found.`);
        }
        return order;
    }
    async createOrder(userId, amount, planId) {
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };
        console.log(userId, amount, options);
        const razorpayOrder = await this.razorpay.orders.create(options);
        const order = new this.orderModel({
            userId,
            planId,
            amount: Number(razorpayOrder.amount) / 100,
            currency: options.currency,
            receipt: options.receipt,
            orderId: razorpayOrder.id,
            status: 'pending',
        });
        return await order.save();
    }
    async updateOrderStatus(orderId, status, paymentDetails) {
        return await this.orderModel.findOneAndUpdate({ orderId }, { status, paymentDetails }, { new: true });
    }
    async getUserOrders(userId) {
        return await this.orderModel.find({ userId }).exec();
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_entity_1.Order.name)),
    __param(1, (0, nestjs_razorpay_1.InjectRazorpay)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        razorpay_1.default])
], OrderService);
//# sourceMappingURL=order.service.js.map