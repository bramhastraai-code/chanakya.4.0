import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Lead } from './lead.entity';

export type LeadActivityDocument = LeadActivity & Document;

export enum ActivityType {
  STATUS_CHANGE = 'status_change',
  NOTE_ADDED = 'note_added',
  CALL_MADE = 'call_made',
  EMAIL_SENT = 'email_sent',
  MEETING_SCHEDULED = 'meeting_scheduled',
  SITE_VISIT = 'site_visit',
}

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class LeadActivity {
  @Prop({ type: Types.ObjectId, ref: 'Lead', required: true })
  lead: Lead;

  @Prop({ type: String, enum: ActivityType, required: true })
  type: ActivityType;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  performedBy?: Types.ObjectId; // User who performed this activity

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  createdAt: Date;
}

export const LeadActivitySchema = SchemaFactory.createForClass(LeadActivity);

// Index for efficient timeline queries
LeadActivitySchema.index({ lead: 1, createdAt: -1 });
LeadActivitySchema.index({ performedBy: 1 });
