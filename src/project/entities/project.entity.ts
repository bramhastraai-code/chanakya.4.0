import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Amenity } from 'src/amenity/entities/amenity.entity';
import { Builder } from 'src/builder/entities/builder.entity';
import { User } from 'src/user/entity/user.entity';
import { ProjectAffordability, ProjectCategory } from '../enum/project.enum';
import { Status } from 'src/common/enum/status.enum';
import {
  BHKConfiguration,
  OfferVariant,
  TagVariant,
} from 'src/property/enum/property.enum';
import { Property } from 'src/property/entities/property.entity';
import { ProjectStatus } from '../project.enum';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true, index: true })
  projectName: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true, index: true })
  description: string;

  // Referencing Builder entity
  @Prop({
    type: () => MongooseSchema.Types.ObjectId,
    ref: 'Builder',
    required: true,
  })
  builder: Builder;

  @Prop({ required: true })
  projectType: string;

  @Prop({
    default: ProjectCategory.NEWLY_ADDED,
    enum: ProjectCategory,
    required: true,
  })
  projectCategory: ProjectCategory;

  @Prop({
    default: ProjectAffordability.AFFORDABLE,
    enum: ProjectAffordability,
    required: true,
  })
  projectAffordability: ProjectAffordability;

  @Prop({ default: undefined, enum: ProjectStatus })
  projectStatus?: ProjectStatus;

  @Prop({ type: [String], enum: Object.values(BHKConfiguration) })
  PropertyConfig: BHKConfiguration[];

  @Prop({ default: null })
  priceAverage: number;

  @Prop({ default: null })
  priceMin?: number;

  @Prop({ default: null })
  priceMax?: number;

  @Prop({})
  videoLink?: string;

  @Prop({ type: String })
  floorPlan?: string;

  @Prop({ type: String })
  masterPlan?: string;

  @Prop({
    type: [
      {
        resource: { type: String },
        distance: { type: String },
      },
    ],
    required: false,
    default: [],
  })
  nearby?: Array<{ resource: string; distance: number }>;

  @Prop({ default: null })
  minCarpetArea?: number;

  @Prop({ default: null })
  maxCarpetArea?: number;

  @Prop({ default: null })
  since?: number;

  // Address details
  @Prop({ index: true })
  address: string;

  @Prop({ index: true })
  city: string;

  @Prop({ default: null })
  pinCode: string;

  @Prop({})
  state: string;

  @Prop({ index: true })
  region: string;

  @Prop({})
  landmark: string;

  @Prop({})
  roadDistance: number;

  @Prop({})
  latitude: number;

  @Prop({})
  longitude: number;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: Amenity.name,
  })
  amenities: Amenity[];

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: Amenity.name,
  })
  facilities: Amenity[];

  @Prop({ type: () => [MongooseSchema.Types.ObjectId], ref: () => 'property' })
  properties: Property[];

  @Prop({ type: [String] })
  images: string[];

  @Prop({ index: true })
  seoTitle: string;

  @Prop({ index: true })
  seoDescription: string;

  @Prop({ type: [String], index: true })
  seoKeywords: string[];

  @Prop({ required: true })
  reraNo: string;

  @Prop({ default: 0 })
  view: number;

  @Prop({
    default: Status.IN_ACTIVE,
    enum: Status,
    required: true,
  })
  status: Status;

  @Prop({
    type: [
      {
        text: String,
        variant: { type: String, enum: TagVariant },
        iconUrl: String,
      },
    ],
  })
  tags: { text: string; variant: TagVariant; iconUrl: string }[];

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

  @Prop({
    default: null,
    type: () => MongooseSchema.Types.ObjectId,
    ref: () => User.name,
    required: false,
  })
  createdBy?: User;

  @Prop({
    default: null,
    type: () => MongooseSchema.Types.ObjectId,
    ref: () => User.name,
    required: false,
  })
  updatedBy?: User;

  @Prop({ default: false })
  featured?: boolean;

  @Prop({ default: false })
  exclusive?: boolean;

  @Prop({
    default: null,
    type: () => MongooseSchema.Types.ObjectId,
    ref: () => User.name,
    required: false,
  })
  executiveUser?: User;

  @Prop()
  readyToPossessDate: string;

  @Prop({ default: false })
  quickBuy?: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({
  projectName: 'text',
  description: 'text',
  address: 'text',
  seoTitle: 'text',
  seoKeywords: 'text',
});
// Optional: Pre-save hook to update `updatedAt`
ProjectSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
