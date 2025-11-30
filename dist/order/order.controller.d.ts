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
        data: import("mongoose").Document<unknown, {}, import("./entities/order.entity").OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
    getUserOrders(userId: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./entities/order.entity").OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        message: string;
    }>;
}
