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

  // Project and Builder association (optional - for project-specific requirements)
  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  builderId?: Types.ObjectId;

  // Visibility control
  @Prop({ type: Boolean, default: true })
  isPublic: boolean; // If false, only visible to associated builder and agents

  // Agent acceptance tracking
  @Prop({ type: Types.ObjectId, ref: 'User' })
  acceptedBy?: Types.ObjectId; // Agent who accepted this requirement

  @Prop({ type: Date })
  acceptedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  postedBy?: Types.ObjectId; // Agent who posted this requirement (if posted by agent)

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
RequirementSchema.index({ projectId: 1, status: 1 });
RequirementSchema.index({ builderId: 1, status: 1 });
RequirementSchema.index({ isPublic: 1 });
RequirementSchema.index({ acceptedBy: 1, status: 1 });
RequirementSchema.index({ postedBy: 1, status: 1 });
RequirementSchema.index({ createdAt: -1 });
