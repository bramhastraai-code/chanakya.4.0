import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  profileImage?: string;

  @Prop({ type: [String], default: [] })
  preferredLocations: string[];

  @Prop({ type: Object })
  budgetRange?: {
    min?: number;
    max?: number;
  };

  @Prop({ type: [String], default: [] })
  interestedPropertyTypes: string[]; // apartment, villa, plot, commercial, etc.

  @Prop()
  requirements?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop({ type: [String], default: [] })
  savedSearches: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserProfileSchema =
  SchemaFactory.createForClass(UserProfile);

// Indexes
UserProfileSchema.index({ userId: 1 });
UserProfileSchema.index({ preferredLocations: 1 });
