import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WebsiteTemplate } from './website-template.entity';
import { WebsiteStatus } from '../enum/website.enum';

export type WebsiteDocument = Website & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Website {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  subdomain: string;

  @Prop({ unique: true, sparse: true })
  customDomain?: string;

  @Prop({ type: Types.ObjectId, ref: 'WebsiteTemplate', required: true })
  template: WebsiteTemplate;

  @Prop({ type: Object, default: {} })
  content: Record<string, any>;

  @Prop({ type: Object, default: {} })
  theme: Record<string, any>;

  @Prop({ type: String, enum: WebsiteStatus, default: WebsiteStatus.DRAFT })
  status: WebsiteStatus;

  @Prop()
  publishedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const WebsiteSchema = SchemaFactory.createForClass(Website);

WebsiteSchema.index({ subdomain: 1 });
WebsiteSchema.index({ customDomain: 1 });
