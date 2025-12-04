import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SubscriptionPlanType } from '../enum/subscription.enum';

export type SubscriptionPlanDocument = SubscriptionPlan & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class SubscriptionPlan {
  @Prop({
    type: String,
    enum: SubscriptionPlanType,
    required: true,
    unique: true,
  })
  name: SubscriptionPlanType;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  duration: number; // in days

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  commissionRate: number; // percentage

  @Prop({ type: Number, default: -1 }) // -1 means unlimited
  maxListings: number;

  @Prop({ type: Number, default: -1 }) // -1 means unlimited
  maxLeads: number;

  @Prop({ type: Boolean, default: false })
  aiToolsAccess: boolean;

  @Prop({ type: Boolean, default: false })
  websiteBuilder: boolean;

  @Prop({ type: Number, default: 0 })
  priority: number; // for sorting plans

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);

// Indexes
SubscriptionPlanSchema.index({ name: 1 });
SubscriptionPlanSchema.index({ isActive: 1, priority: 1 });
