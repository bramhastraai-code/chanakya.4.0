import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SuperAdminProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  profileImage?: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop()
  department?: string;

  @Prop()
  designation?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const SuperAdminProfileSchema =
  SchemaFactory.createForClass(SuperAdminProfile);

// Indexes
SuperAdminProfileSchema.index({ userId: 1 });
