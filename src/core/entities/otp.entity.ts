import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiresIn: Date;

  @Prop()
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Index for efficient lookup and auto-expiry
OtpSchema.index({ email: 1 });
OtpSchema.index({ expiresIn: 1 }, { expireAfterSeconds: 0 });
