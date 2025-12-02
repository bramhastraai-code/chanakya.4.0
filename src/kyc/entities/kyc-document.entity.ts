import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { KycSubmission } from './kyc-submission.entity';
import { DocumentType, DocumentStatus } from '../enums/kyc.enum';

export type KycDocumentDocument = KycDocument & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class KycDocument {
  @Prop({ type: Types.ObjectId, ref: 'KycSubmission', required: true })
  kycSubmission: KycSubmission;

  @Prop({ type: String, enum: DocumentType, required: true })
  type: DocumentType;

  @Prop({ required: false })
  number?: string;

  @Prop({ required: true })
  frontImageUrl: string;

  @Prop()
  backImageUrl?: string;

  @Prop({ type: String, enum: DocumentStatus, default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @Prop()
  createdAt: Date;
}

export const KycDocumentSchema = SchemaFactory.createForClass(KycDocument);

// Indexes
KycDocumentSchema.index({ kycSubmission: 1 });
