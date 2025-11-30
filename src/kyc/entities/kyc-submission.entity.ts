import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { KycStatus } from '../enum/kyc.enum';

export type KycSubmissionDocument = KycSubmission & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class KycSubmission {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  @Prop()
  submittedAt: Date;

  @Prop()
  approvedAt?: Date;

  @Prop()
  rejectedAt?: Date;

  @Prop()
  rejectionReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const KycSubmissionSchema = SchemaFactory.createForClass(KycSubmission);

// Indexes
KycSubmissionSchema.index({ userId: 1 });
KycSubmissionSchema.index({ status: 1, submittedAt: -1 });
