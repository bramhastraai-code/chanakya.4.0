import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OfferType, OfferStatus } from '../enum/offer.enum';

export type OfferDocument = Offer & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Offer {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number, required: true, min: 0 })
  incentiveAmount: number;

  @Prop({ type: String, enum: OfferType, required: true })
  type: OfferType;

  @Prop({ type: String, enum: OfferStatus, default: OfferStatus.ACTIVE })
  status: OfferStatus;

  @Prop({ type: [String], default: [] })
  termsAndConditions: string[];

  @Prop({ type: Number, min: 0 })
  minUnitsToSell?: number;

  @Prop({ type: Number, min: 0 })
  commissionPercentage?: number;

  @Prop()
  validFrom?: Date;

  @Prop()
  validUntil?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);

OfferSchema.index({ status: 1 });
OfferSchema.index({ type: 1 });
OfferSchema.index({ project: 1 });
OfferSchema.index({ createdBy: 1 });
OfferSchema.index({ validFrom: 1, validUntil: 1 });
