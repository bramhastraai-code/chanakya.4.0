import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/core/entities/user.entity';

export type ChatHistoryDocument = ChatHistory & Document;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class ChatHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  agent: User;

  @Prop({
    type: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  messages: ChatMessage[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);

// Indexes
ChatHistorySchema.index({ agent: 1, createdAt: -1 });
