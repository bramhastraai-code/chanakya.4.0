import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BountyType, BountyStatus } from '../enum/bounty.enum';

export type BountyDocument = Bounty & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Bounty {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number, required: true, min: 0 })
  rewardAmount: number;

  @Prop({ type: String, enum: BountyType, required: true })
  type: BountyType;

  @Prop({ type: String, enum: BountyStatus, default: BountyStatus.ACTIVE })
  status: BountyStatus;

  @Prop({ type: [String], default: [] })
  requirements: string[];

  @Prop()
  expiryDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BountySchema = SchemaFactory.createForClass(Bounty);

BountySchema.index({ status: 1 });
BountySchema.index({ type: 1 });
