import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { VideoSourceType, VideoStatus } from '../enums/video.enum';

@Schema({
  timestamps: true,
})
export class Video extends Document {
  @Prop({ required: true, ref: 'Customer' })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: String, enum: VideoSourceType, required: true })
  sourceType: VideoSourceType;

  @Prop({
    required: function () {
      return this.sourceType === VideoSourceType.S3;
    },
  })
  s3Key?: string;

  @Prop({
    required: function () {
      return this.sourceType === VideoSourceType.YOUTUBE;
    },
  })
  youtubeUrl?: string;

  @Prop({ type: String, enum: VideoStatus, default: VideoStatus.PENDING })
  status: VideoStatus;

  @Prop({ default: null })
  approvedAt?: Date;

  @Prop({ default: null })
  rejectedAt?: Date;

  @Prop({ default: null })
  rejectionReason?: string;

  @Prop({ default: 0 })
  earnings: number;

  @Prop({ ref: 'Project' })
  projectId?: string;

  // Virtual for public URL (will be populated based on sourceType)
  publicUrl?: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
