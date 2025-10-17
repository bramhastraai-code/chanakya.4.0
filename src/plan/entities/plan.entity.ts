import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true }) // This enables the automatic creation of `createdAt` and `updatedAt` fields.
export class Plan {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: false })
  billingInfo?: string; // Optional field for "sell" product type

  @Prop({ required: true, type: [String] })
  features: string[] | { name: string; included: boolean }[];

  @Prop({ required: false })
  color?: string; // Specific to "advice" product type

  @Prop({ required: false })
  popular?: boolean; // Specific to "advice" product type

  @Prop({ required: false })
  bgColor?: string; // Specific to "sell" product type

  @Prop({ required: false })
  logo?: string; // Specific to "sell" product type

  @Prop({ required: true })
  productType: string; // "advice" or "sell"

  @Prop({ default: 'active', enum: ['active', 'inactive'] }) // Field for the status of the plan
  status: string; // Can be 'active' or 'inactive'

  @Prop({ required: false, type: String })
  createdBy: string; // ID of the user who created the plan

  @Prop({ required: false, type: String })
  updatedBy?: string; // ID of the user who last updated the plan
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
