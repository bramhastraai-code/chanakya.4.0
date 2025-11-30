import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RequirementStatus, TransactionType } from '../enum/requirement.enum';

export type RequirementDocument = Requirement & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Requirement {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  propertyType: string;

  @Prop({ type: String, enum: TransactionType, required: true })
  transactionType: TransactionType;

  @Prop()
  configuration?: string;

  @Prop({ type: Number })
  priceMin?: number;

  @Prop({ type: Number })
  priceMax?: number;

  @Prop()
  area?: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [String], default: [] })
  amenities?: string[];

  @Prop({ type: Date })
  possessionDate?: Date;

  @Prop()
  details?: string;

  @Prop({
    type: String,
    enum: RequirementStatus,
    default: RequirementStatus.OPEN,
  })
  status: RequirementStatus;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RequirementSchema = SchemaFactory.createForClass(Requirement);

// Indexes
RequirementSchema.index({ userId: 1, status: 1 });
RequirementSchema.index({ location: 1, status: 1 });
RequirementSchema.index({ propertyType: 1, transactionType: 1 });
RequirementSchema.index({ createdAt: -1 });
