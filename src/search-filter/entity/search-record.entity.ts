import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SearchRecord extends Document {
  @Prop({ required: true })
  term: string;

  @Prop({ default: 0 })
  popularity: number;

  @Prop()
  userId?: string;
}

export const SearchRecordSchema = SchemaFactory.createForClass(SearchRecord);
