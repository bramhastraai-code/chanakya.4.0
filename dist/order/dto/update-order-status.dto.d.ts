import { OrderStatus } from '../enum/order.enum';
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
    paymentDetails?: Record<string, any>;
}
