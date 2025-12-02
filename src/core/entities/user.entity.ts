import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'src/common/enum/user-role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, required: true })
  role: UserRole;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isPhoneVerified: boolean;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop()
  fcmToken?: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  lastLoginAt?: Date;

  // Basic profile fields (DEPRECATED - use profile entities instead)
  @Prop()
  name?: string;

  @Prop()
  gender?: string;

  @Prop()
  DOB?: Date;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  // Legacy fields for backward compatibility (DEPRECATED - use profile entities instead)
  @Prop()
  licenseNumber?: string;

  @Prop()
  yearsOfExperience?: number;

  @Prop()
  agencyName?: string;

  @Prop()
  teamSize?: number;

  @Prop([String])
  specializations?: string[];

  @Prop([String])
  serviceAreas?: string[];

  @Prop()
  profileImage?: string;

  @Prop({ type: Object })
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };

  @Prop()
  websiteUrl?: string;

  // Timestamps
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
