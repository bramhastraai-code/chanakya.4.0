// schemas/user-behavior.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from 'src/customer/entities/customer.entity';

export enum UserBehaviorType {
  PAGE_VIEW = 'page_view',
  CTA_CLICK = 'cta_click',
}

export interface DeviceInfo {
  os: string;
  browser: string;
  deviceType: string;
}

@Schema({ timestamps: true })
export class UserBehavior extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer' })
  user: Types.ObjectId | Customer;

  @Prop({ required: false, enum: ['new', 'old'], default: 'old' })
  userType?: 'new' | 'old';

  @Prop({ default: null })
  sessionId: string;

  @Prop()
  fcmToken?: string;

  @Prop({ default: null, enum: UserBehaviorType })
  type: UserBehaviorType;

  // Common fields for all event types
  @Prop({ default: null })
  pageUrl: string;

  @Prop()
  pageTitle?: string;

  @Prop({ default: null })
  section: string;

  @Prop()
  referrer?: string;

  @Prop()
  ipAddress?: string;

  @Prop({ type: Object })
  deviceInfo?: DeviceInfo;

  // Fields specific to CTA clicks
  @Prop()
  ctaId?: string;

  @Prop()
  ctaType?: string; // 'button', 'link', 'form', etc.

  @Prop()
  ctaText?: string;

  // Additional metadata
  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const UserBehaviorSchema = SchemaFactory.createForClass(UserBehavior);
