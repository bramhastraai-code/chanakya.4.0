import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionPlanDocument = SubscriptionPlan & Document;

@Schema({ timestamps: true })
export class SubscriptionPlan {
  @Prop({ required: true })
  name: string;

  @Prop()
  displayName: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  duration: number; // days

  @Prop([String])
  features: string[];

  @Prop()
  commissionRate: number;

  @Prop()
  maxListings: number;

  @Prop()
  maxLeads: number;

  @Prop()
  aiToolsAccess: boolean;

  @Prop()
  websiteBuilder: boolean;

  @Prop()
  priority: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);
