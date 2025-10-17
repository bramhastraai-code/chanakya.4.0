import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true }) // Automatically generates createdAt and updatedAt
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  receipt: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ default: 'pending' }) // pending, success, failed
  status: string;

  @Prop({ default: {} })
  paymentDetails: Array<any>;

  @Prop({ required: false, type: String })
  createdBy: string; // ID of the user who created the order

  @Prop({ required: false, type: String })
  updatedBy?: string; // ID of the user who last updated the order
}

export const OrderSchema = SchemaFactory.createForClass(Order);
