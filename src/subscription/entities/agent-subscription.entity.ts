import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/core/entities/user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
import { SubscriptionStatus } from '../enum/subscription.enum';

export type AgentSubscriptionDocument = AgentSubscription & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class AgentSubscription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  agent: User;

  @Prop({ type: Types.ObjectId, ref: 'SubscriptionPlan', required: true })
  plan: SubscriptionPlan;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: String, enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @Prop()
  paymentId?: string;

  @Prop()
  orderId?: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ type: Number, default: 0, min: 0 })
  commissionSaved: number;

  @Prop({ type: Boolean, default: false })
  autoRenew: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AgentSubscriptionSchema = SchemaFactory.createForClass(AgentSubscription);

// Indexes
AgentSubscriptionSchema.index({ agent: 1, status: 1 });
AgentSubscriptionSchema.index({ endDate: 1, status: 1 });
