import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Property } from 'aws-sdk/clients/appflow';
import { Project } from 'aws-sdk/clients/kendra';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/entity/user.entity';

@Schema({ timestamps: true })
export class Saved extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: false })
  project?: Project;

  @Prop({ type: Types.ObjectId, ref: 'Property', required: false })
  property?: Property;

  @Prop({ default: Date.now })
  savedAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const SavedSchema = SchemaFactory.createForClass(Saved);
