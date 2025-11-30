import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Requirement } from './requirement.entity';
import { Property } from 'src/property/entities/property.entity';

export type RequirementMatchDocument = RequirementMatch & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class RequirementMatch {
  @Prop({ type: Types.ObjectId, ref: 'Requirement', required: true })
  requirement: Requirement;

  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  property: Property;

  @Prop({ type: Number, min: 0, max: 100, required: true })
  matchScore: number;

  @Prop()
  matchedAt: Date;

  @Prop({ type: Object })
  matchDetails?: Record<string, any>;
}

export const RequirementMatchSchema = SchemaFactory.createForClass(RequirementMatch);

// Indexes
RequirementMatchSchema.index({ requirement: 1, matchScore: -1 });
RequirementMatchSchema.index({ property: 1 });
