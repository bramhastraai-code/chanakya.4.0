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
    updateOrderStatus(orderId: string, status: string, paymentDetails: any): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getUserOrders(userId: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
