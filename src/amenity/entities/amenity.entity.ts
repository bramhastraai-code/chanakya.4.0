import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'aws-sdk/clients/budgets';
import { Document, Types } from 'mongoose';
@Schema()
export class Amenity extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: String })
  iconImage: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: User;

  // Metadata
  @Prop()
  views: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);
