import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  LeadStatus,
  UserStatus,
  UserType,
  VerificationStatus,
} from '../enum/usertype.enum';

@Schema({ timestamps: true })
export class Customer extends Document {
  // introduction
  @Prop({ type: String, trim: true, index: 'text' })
  name?: string;

  @Prop()
  userImage: string;

  @Prop({ type: String, default: null })
  fcmToken?: string;

  @Prop({
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    sparse: true,
  })
  email?: string;

  @Prop({ default: UserType.USER, enum: UserType })
  userType: UserType;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  // customer related fields
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
  })
  assignAgent: mongoose.Types.ObjectId | Customer | string;

  @Prop({ default: [] })
  projectsApplied: string[];

  @Prop({
    type: String,
    enum: LeadStatus,
    default: 'new',
  })
  contactStatus?: string;

  // broker related fields

  @Prop({ required: false, default: '1 day' })
  responseTime?: string;

  @Prop({ type: [String], default: [] })
  serviceAreas: string[];

  @Prop({
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.PENDING,
  })
  verificationStatus: string;

  @Prop()
  verificationDocuments?: string[];

  @Prop()
  licenseNumber?: string;

  @Prop()
  licenseExpiry?: Date;

  @Prop()
  yearsOfExperience?: number;

  // For agencies
  @Prop()
  agencyName?: string;

  @Prop()
  agencyLicense?: string;

  @Prop()
  agencyFoundedYear?: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  teamSize?: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  rating: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  reviewCount: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  closedDeals: number;

  // things for logic

  @Prop({ default: UserStatus.ACTIVE, enum: UserStatus })
  status: UserStatus;

  @Prop()
  refreshToken: string;

  // social media things

  socialMedia?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };

  // address things

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;

  @Prop({ type: String, trim: true, index: true })
  address: string;

  @Prop({ type: String, trim: true, index: true })
  city: string;

  @Prop({ type: String, trim: true, index: true })
  state: string;

  @Prop({ type: String, trim: true, index: true })
  country: string;

  @Prop()
  pinCode: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Builder' }],
    default: [],
  })
  builders: mongoose.Types.ObjectId[] | string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({
    type: [
      {
        previousStatus: { type: String, enum: LeadStatus },
        newStatus: { type: String, enum: LeadStatus },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now },
        notes: String,
      },
    ],
    default: [],
  })
  statusHistory: Array<{
    previousStatus: LeadStatus;
    newStatus: LeadStatus;
    changedBy: string;
    changedAt: Date;
    notes?: string;
  }>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index({
  name: 'text',
  email: 'text',
  agencyName: 'text',
  UserType: 'text',
});
