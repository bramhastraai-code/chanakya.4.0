import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AgentBuilderAssociation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  agentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  builderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop()
  invitedBy?: Types.ObjectId; // Admin or Builder who invited

  @Prop()
  invitedAt?: Date;

  @Prop()
  approvedAt?: Date;

  @Prop()
  rejectedAt?: Date;

  @Prop()
  rejectionReason?: string;

  @Prop()
  notes?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AgentBuilderAssociationSchema = SchemaFactory.createForClass(
  AgentBuilderAssociation,
);

// Compound indexes for efficient queries
AgentBuilderAssociationSchema.index(
  { agentId: 1, builderId: 1, projectId: 1 },
  { unique: true },
);
AgentBuilderAssociationSchema.index({ agentId: 1, isActive: 1 });
AgentBuilderAssociationSchema.index({ builderId: 1, isActive: 1 });
AgentBuilderAssociationSchema.index({ projectId: 1, isActive: 1 });
AgentBuilderAssociationSchema.index({ status: 1 });
