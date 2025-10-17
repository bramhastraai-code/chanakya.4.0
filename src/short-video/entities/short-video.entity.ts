import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Project } from 'src/project/entities/project.entity';
import { Status } from 'src/common/enum/status.enum';

@Schema({ timestamps: true })
export class ShortVideo extends Document {
  @Prop({})
  videoUrl: string;

  @Prop({})
  thumbnail?: string;

  @Prop({ default: null })
  title?: string;

  @Prop({ default: null })
  description?: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  shares: number;

  // Referencing the associated Project entity
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  associatedProject: Project;

  @Prop({ default: 0 })
  priority: number; // Field to define the priority of the short video

  @Prop({
    default: Status.IN_ACTIVE,
    enum: Status,
  })
  status: Status; // Active or Inactive status

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ShortVideoSchema = SchemaFactory.createForClass(ShortVideo);

// Optional: Pre-save hook to update `updatedAt`
ShortVideoSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

ShortVideoSchema.index({ title: 'text', description: 'text' });
