import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Bounty } from './bounty.entity';
import { SubmissionStatus } from '../enum/bounty.enum';

export type BountySubmissionDocument = BountySubmission & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class BountySubmission {
  @Prop({ type: Types.ObjectId, ref: 'Bounty', required: true })
  bounty: Bounty;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Object, required: true })
  submissionData: Record<string, any>;

  @Prop({
    type: String,
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @Prop()
  adminFeedback?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BountySubmissionSchema =
  SchemaFactory.createForClass(BountySubmission);

BountySubmissionSchema.index({ bounty: 1, userId: 1 }); // One submission per bounty per user? Maybe not unique.
BountySubmissionSchema.index({ status: 1 });
