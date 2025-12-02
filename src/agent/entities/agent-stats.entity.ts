import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/core/entities/user.entity';

@Schema({ timestamps: true })
export class AgentStats extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  agent: User;

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
