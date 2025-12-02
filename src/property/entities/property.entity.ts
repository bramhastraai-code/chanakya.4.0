import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/core/entities/user.entity';
import {
  BHKConfiguration,
  FacingDirection,
  FurnishingStatus,
  OfferVariant,
  PGAvailableFor,
  PlotType,
  PropertyCategory,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
  TagVariant,
} from '../enum/property.enum';
import { Status } from 'src/common/enum/status.enum';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Property extends Document {
  // Main details
  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true, index: true })
  propertyTitle: string;

  @Prop({ index: true })
  propertyDescription?: string;

  @Prop({})
  propertyOwner?: string;

  @Prop({})
  OwnerContactNumber?: string;

  @Prop({})
  propertyExecutive?: string;

  @Prop({ default: undefined, enum: PropertyType })
  propertyType?: PropertyType;

  @Prop({ default: undefined, enum: PropertyPurpose })
  propertyPurpose?: PropertyPurpose;

  @Prop({ default: undefined, enum: PropertyStatus })
  propertyStatus?: PropertyStatus;

  @Prop({ default: undefined, enum: PropertyCategory })
  propertyCategory?: PropertyCategory;
  // Configuration
  @Prop({ default: undefined, enum: BHKConfiguration })
  bhkConfiguration?: BHKConfiguration;

  @Prop({ default: undefined, enum: FurnishingStatus })
  furnishingStatus?: FurnishingStatus;

  @Prop({})
  propertyAge?: number;

  @Prop({})
  propertyAgeMonth?: number;

  @Prop({})
  totalArea?: number;

  @Prop({})
  carpetArea?: number;

  @Prop({})
  balconyCount?: number;

  @Prop({})
  bathroomCount?: number;

  @Prop({})
  bedCount?: number;

  @Prop({})
  parkingCount?: number;

  @Prop({})
  floorNumber?: number;

  @Prop({})
  totalFloors?: number;

  @Prop({ default: undefined, enum: FacingDirection })
  facingDirection?: FacingDirection;

  // Amenities & Facilities
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Amenity' }] })
  amenities?: Types.Array<Types.ObjectId>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Amenity' }] })
  facilities?: Types.Array<Types.ObjectId>;

  // Address details
  @Prop({ index: true })
  address?: string;

  @Prop({})
  city?: string;

  @Prop({})
  state?: string;

  @Prop({})
  region?: string;

  @Prop({})
  landmark?: string;

  @Prop({})
  roadDistance?: number;

  @Prop({})
  latitude?: number;

  @Prop({})
  longitude?: number;

  @Prop({})
  country?: string;

  @Prop({})
  pinCode?: string;

  // Pricing details
  @Prop({})
  price?: number;

  @Prop({})
  pricePerUnit?: number;

  @Prop({})
  maintenanceCharge?: number;

  @Prop({})
  deposit?: number;

  @Prop({})
  totalPrice?: number;

  // Media
  @Prop({ type: [String] })
  images?: string[];

  @Prop({})
  videoLink?: string;

  @Prop({ type: String })
  floorPlan?: string;

  @Prop({ type: String })
  masterPlan?: string;

  // SEO
  @Prop({ index: true })
  seoTitle?: string;

  @Prop({ index: true })
  seoDescription?: string;

  @Prop({ type: [String], index: true })
  seoKeywords?: string[];

  // Additional information
  // @Prop({})
  // washroomFor: string;

  @Prop({ default: undefined, enum: PlotType })
  plotType?: PlotType;

  @Prop({ default: undefined, enum: PGAvailableFor })
  pgAvailableFor?: PGAvailableFor;

  // Tags and Featured Status
  @Prop({
    type: [
      {
        text: String,
        variant: { type: String, enum: TagVariant },
        iconUrl: String,
      },
    ],
  })
  tags?: { text: string; variant: TagVariant; iconUrl: string }[];

  @Prop({
    type: [
      {
        text: String,
        variant: { type: String, enum: OfferVariant },
        description: String,
      },
    ],
  })
  offers: { text: string; variant: OfferVariant; description: string }[];

  @Prop({ default: false })
  featured?: boolean;

  // Relations
  @Prop({ type: Types.ObjectId, ref: 'User' })
  builderId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId?: Project;

  // Owner (Agent/Builder who created the property)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  customer?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;

  // Approval workflow
  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  approvalStatus: string;

  @Prop()
  approvalNotes?: string;

  @Prop()
  rejectionReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  approvedAt?: Date;

  // Metadata
  @Prop()
  views?: number;

  @Prop({ default: Status.IN_ACTIVE, enum: Status })
  status?: Status;

  @Prop({
    type: [
      {
        resource: { type: String },
        distance: { type: Number },
      },
    ],
    required: false, // Mark the field as optional
    default: [], // Default value as an empty array
  })
  nearby?: Array<{ resource: string; distance: number }>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
PropertySchema.index({
  propertyTitle: 'text',
  propertyDescription: 'text',
  address: 'text',
  seoTitle: 'text',
  seoKeywords: 'text',
});
