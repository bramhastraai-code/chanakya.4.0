import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/entity/user.entity';

export type ContentType = 'Image' | 'Video';
export type AdType = 'Banner' | 'Popup' | 'Sidebar';
export type IndustrySegment =
  | 'RealEstate'
  | 'ElectricalAppliances'
  | 'ConstructionMaterials'
  | 'Services'
  | 'ProductRelatedToRealEstate';

@Schema({ timestamps: true })
export class Banner extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['Image', 'Video'], required: true })
  contentType: ContentType;

  @Prop()
  imageUrl?: string; // URL of the image if contentType is Image

  @Prop()
  videoUrl?: string; // URL of the video if contentType is Video

  @Prop()
  imageUrlForMobile?: string;

  @Prop({ required: true })
  link: string;

  @Prop({ enum: ['Banner', 'Popup', 'Sidebar'], required: true })
  adType: AdType;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  additionalInfo?: string;

  @Prop({ type: [{ region: String, city: String, country: String }] })
  executionArea?: {
    region: string;
    city?: string;
    country?: string;
  }[];

  @Prop({
    enum: [
      'RealEstate',
      'ElectricalAppliances',
      'ConstructionMaterials',
      'Services',
      'ProductRelatedToRealEstate',
    ],
    required: true,
  })
  industrySegment: IndustrySegment;

  @Prop({ type: Types.ObjectId, ref: User.name }) // Reference to User schema
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name }) // Reference to User schema
  updatedBy: Types.ObjectId;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
