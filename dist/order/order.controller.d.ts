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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getOrders(pageSize: string, pageNumber: string, sortBy: string, sortOrder: 'asc' | 'desc', searchQuery?: string, status?: string): Promise<{
        data: {
            orders: Order[];
            totalPages: number;
            totalOrders: number;
            pageSize: number;
            pageNumber: number;
        };
        message: string;
    }>;
    findOne(id: string): Promise<{
        data: Order;
        message: string;
    }>;
    createOrder(createOrderDto: CreateOrderDto): Promise<{
        data: Order;
        message: string;
    }>;
    updateOrderStatus(orderId: string, updateStatusDto: UpdateOrderStatusDto): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./entities/order.entity").OrderDocument> & Order & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
        message: string;
    }>;
    getUserOrders(userId: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./entities/order.entity").OrderDocument> & Order & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        message: string;
    }>;
}
