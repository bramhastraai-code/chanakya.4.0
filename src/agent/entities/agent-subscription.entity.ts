import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/core/entities/user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Schema({ timestamps: true })
export class AgentSubscription extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  agent: User;

  @Prop({ type: Types.ObjectId, ref: 'SubscriptionPlan', required: true })
  plan: SubscriptionPlan;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    required: true,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  })
  status: string;

  @Prop({ required: true })
  amount: number;
}

export const AgentSubscriptionSchema =
  SchemaFactory.createForClass(AgentSubscription);
