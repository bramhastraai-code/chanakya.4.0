import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from 'src/customer/entities/customer.entity';
import { User } from 'src/user/entity/user.entity';

@Schema({ timestamps: true }) // Automatically adds `createdAt` and `updatedAt` fields
export class Builder extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: String, default: null })
  fcmToken?: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  alternatePhone?: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

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

  @Prop()
  logo?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Inquiry' }] })
  inquiries?: Types.Array<Types.ObjectId>;

  // Metadata
  @Prop()
  views?: number;

  @Prop()
  since?: number;

  @Prop()
  totalProject?: number;

  @Prop({ type: Types.ObjectId, ref: 'Customer', default: null })
  owner?: Customer;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: User;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: 'active' })
  status: string;
}

export const BuilderSchema = SchemaFactory.createForClass(Builder);
