import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AgentSubscriptionDocument = AgentSubscription & Document;

@Schema({ timestamps: true })
export class AgentSubscription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  agent: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SubscriptionPlan', required: true })
  plan: Types.ObjectId;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: 'active' })
  status: string; // active|expired|cancelled

  @Prop()
  paymentId: string;

  @Prop()
  amount: number;

  @Prop({ default: 0 })
  commissionSaved: number;
}

export const AgentSubscriptionSchema = SchemaFactory.createForClass(AgentSubscription);
