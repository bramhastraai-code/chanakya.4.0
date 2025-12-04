import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AgentProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  profileImage?: string;

  @Prop()
  company?: string;

  @Prop()
  designation?: string;

  @Prop({ type: Number, default: 0 })
  experienceYears: number;

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop()
  bio?: string;

  @Prop()
  licenseNumber?: string;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ type: Number, default: 0 })
  totalDeals: number;

  @Prop({ type: Number, default: 0 })
  activeListings: number;

  @Prop({ type: [String], default: [] })
  specialization: string[];

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  // Wallet
  @Prop({ type: Number, default: 0 })
  walletBalance: number;

  @Prop({ type: Number, default: 0 })
  pendingEarnings: number;

  @Prop({ type: Number, default: 0 })
  lifetimeEarnings: number;

  // KYC
  @Prop({ type: Boolean, default: false })
  isKycVerified: boolean;

  @Prop({
    type: String,
    enum: ['not_submitted', 'pending', 'approved', 'rejected'],
    default: 'not_submitted',
  })
  kycStatus: string;

  // Social & Website
  @Prop({ type: Object })
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };

  @Prop()
  websiteUrl?: string;

  // Location
  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop({ type: [String], default: [] })
  serviceAreas: string[];

  // Builder & Project Associations
  @Prop({
    type: [
      {
        builderId: { type: Types.ObjectId, ref: 'User' },
        projectId: { type: Types.ObjectId, ref: 'Project' },
        isActive: { type: Boolean, default: true },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  builderAssociations?: Array<{
    builderId: Types.ObjectId;
    projectId: Types.ObjectId;
    isActive: boolean;
    joinedAt: Date;
  }>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AgentProfileSchema = SchemaFactory.createForClass(AgentProfile);

// Indexes
AgentProfileSchema.index({ userId: 1 });
AgentProfileSchema.index({ city: 1, state: 1 });
AgentProfileSchema.index({ isVerified: 1 });
AgentProfileSchema.index({ rating: -1 });
