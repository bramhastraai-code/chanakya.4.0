/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import Razorpay from 'razorpay';
export declare class OrderService {
    private orderModel;
    private readonly razorpay;
    constructor(orderModel: Model<OrderDocument>, razorpay: Razorpay);
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: string): Promise<{
        orders: Order[];
        totalPages: number;
        totalOrders: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Order>;
    createOrder(userId: string, amount: number, planId: string): Promise<Order>;
    updateOrderStatus(orderId: string, status: string, paymentDetails: any): Promise<import("mongoose").Document<unknown, {}, OrderDocument> & Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getUserOrders(userId: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument> & Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
