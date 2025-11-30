import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from 'src/customer/entities/customer.entity';
import { Property } from 'src/property/entities/property.entity';
import { TransactionType, TransactionStatus } from '../enum/transaction.enum';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  user: Customer;

  @Prop({ type: String, enum: TransactionType, required: true })
  type: TransactionType;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Property' })
  property?: Property;

  @Prop({ type: Types.ObjectId, ref: 'Bounty' })
  bounty?: Types.ObjectId;

  @Prop({ type: String, enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Prop({ type: Number, required: true })
  balanceAfter: number;

  @Prop()
  paymentId?: string;

  @Prop()
  orderId?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Indexes for efficient queries
TransactionSchema.index({ user: 1, createdAt: -1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ status: 1 });
