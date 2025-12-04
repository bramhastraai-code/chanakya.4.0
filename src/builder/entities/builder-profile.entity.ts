import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BuilderProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  companyName: string;

  @Prop()
  companyLogo?: string;

  @Prop()
  establishedYear?: number;

  @Prop({ type: Number, default: 0 })
  totalProjects: number;

  @Prop({ type: Number, default: 0 })
  ongoingProjects: number;

  @Prop({ type: Number, default: 0 })
  completedProjects: number;

  @Prop()
  reraNumber?: string;

  @Prop()
  gstin?: string;

  @Prop({ type: Object })
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  @Prop()
  contactPerson?: string;

  @Prop()
  contactEmail?: string;

  @Prop()
  contactPhone?: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  rating: number;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  certifications: string[];

  @Prop({ type: Object })
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BuilderProfileSchema =
  SchemaFactory.createForClass(BuilderProfile);

// Indexes
BuilderProfileSchema.index({ userId: 1 });
BuilderProfileSchema.index({ 'address.city': 1, 'address.state': 1 });
BuilderProfileSchema.index({ isVerified: 1 });
BuilderProfileSchema.index({ rating: -1 });
