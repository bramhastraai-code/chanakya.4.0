import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/core/entities/user.entity';
import { Property } from 'src/property/entities/property.entity';

export type BookmarkedPropertyDocument = BookmarkedProperty & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class BookmarkedProperty {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  agent: User;

  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  property: Property;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BookmarkedPropertySchema = SchemaFactory.createForClass(BookmarkedProperty);

// Indexes
BookmarkedPropertySchema.index({ agent: 1, property: 1 }, { unique: true });
BookmarkedPropertySchema.index({ agent: 1, createdAt: -1 });
