import { Document, Types } from 'mongoose';
export type OrderDocument = Order & Document;
export declare class Order {
    userId: Types.ObjectId;
    planId: string;
    amount: number;
    currency: string;
    receipt: string;
    orderId: string;
    status: string;
    paymentDetails: Array<any>;
    createdBy: string;
    updatedBy?: string;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
