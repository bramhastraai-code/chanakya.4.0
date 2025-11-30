import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/core/entities/user.entity';

export type AgentStatsDocument = AgentStats & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class AgentStats {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  agent: User;

  @Prop({ type: Number, default: 0, min: 0 })
  views: number;

  @Prop({ type: Number, default: 0, min: 0 })
  retwines: number;

  @Prop({ type: Number, default: 0, min: 0 })
  leads: number;

  @Prop({ type: Number, default: 0, min: 0 })
  calls: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalListings: number;

  @Prop({ type: Number, default: 0, min: 0 })
  rentalListings: number;

  @Prop({ type: Number, default: 0, min: 0 })
  resellListings: number;

  @Prop({ type: Number, default: 0, min: 0 })
  projectListings: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AgentStatsSchema = SchemaFactory.createForClass(AgentStats);

// Indexes
AgentStatsSchema.index({ agent: 1 });
