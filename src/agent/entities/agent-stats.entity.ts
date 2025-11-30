import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AgentStatsDocument = AgentStats & Document;

@Schema({ timestamps: true })
export class AgentStats {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  agent: Types.ObjectId;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  retwines: number;

  @Prop({ default: 0 })
  leads: number;

  @Prop({ default: 0 })
  calls: number;
}

export const AgentStatsSchema = SchemaFactory.createForClass(AgentStats);
