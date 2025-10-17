import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AgentInquiry extends Document {
  @Prop({})
  name?: string;

  @Prop({})
  email?: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  YearOfExperience: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  pinCode: string;

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AgentInquirySchema = SchemaFactory.createForClass(AgentInquiry);
