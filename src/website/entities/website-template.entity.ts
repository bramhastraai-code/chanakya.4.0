import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TemplateCode } from '../enum/website.enum';

export type WebsiteTemplateDocument = WebsiteTemplate & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class WebsiteTemplate {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: TemplateCode, required: true, unique: true })
  code: TemplateCode;

  @Prop({ required: true })
  previewImage: string;

  @Prop({ type: Object, default: {} })
  defaultStructure: Record<string, any>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const WebsiteTemplateSchema =
  SchemaFactory.createForClass(WebsiteTemplate);
