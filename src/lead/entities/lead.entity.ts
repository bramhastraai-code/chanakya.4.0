import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Property } from 'src/property/entities/property.entity';
import { LeadStatus } from '../enum/lead-status.enum';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Lead {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop()
  customerEmail?: string;

  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  property: Property;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo?: Types.ObjectId; // Agent assigned to this lead

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId; // User who created the lead

  @Prop({ type: String, enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  @Prop({ type: Number })
  budgetMin?: number;

  @Prop({ type: Number })
  budgetMax?: number;

  @Prop()
  preferredLocation?: string;

  @Prop()
  requirements?: string;

  @Prop()
  notes?: string;

  @Prop()
  lastContactedAt?: Date;

  // New fields
  @Prop({
    type: String,
    enum: ['website', 'mobile_app', 'direct', 'referral'],
    default: 'website',
  })
  source: string;

  @Prop({ type: Boolean, default: false })
  isQualified: boolean;

  @Prop()
  assignedAt?: Date;

  // Project and Builder association (from property)
  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  builderId?: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

// Indexes for efficient queries
LeadSchema.index({ assignedTo: 1, status: 1 });
LeadSchema.index({ property: 1 });
LeadSchema.index({ customerPhone: 1 });
LeadSchema.index({ projectId: 1, status: 1 });
LeadSchema.index({ builderId: 1, status: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ createdBy: 1 });
