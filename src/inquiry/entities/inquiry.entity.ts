import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Inquiry extends Document {
  @Prop({ type: String })
  email?: string;

  @Prop({ type: String })
  name?: string;

  @Prop({ type: String })
  phone?: string;

  @Prop({ type: String })
  companyname?: string;

  @Prop({ type: String })
  title?: string;

  @Prop({
    type: String,
    enum: ['common', 'groupBuy', 'agentSelection', 'quickBuy', 'siteVisit'],
    default: 'common',
  })
  inquiryType:
    | 'common'
    | 'groupBuy'
    | 'agentSelection'
    | 'quickBuy'
    | 'siteVisit'
    | 'loan'
    | 'advisory';

  @Prop({ type: Types.ObjectId, ref: 'Project', default: null })
  projectId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Property', default: null })
  propertyId?: Types.ObjectId | null;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  about: string;

  @Prop({ type: Date, required: false, default: null })
  siteVisitDate?: Date;

  @Prop({ type: String, required: false, default: null })
  siteVisitTime?: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
