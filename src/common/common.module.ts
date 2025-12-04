import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisibilityService } from './services/visibility.service';
import {
  AgentBuilderAssociation,
  AgentBuilderAssociationSchema,
} from '../agent/entities/agent-builder-association.entity';
import {
  Requirement,
  RequirementSchema,
} from '../requirement/entities/requirement.entity';
import { Lead, LeadSchema } from '../lead/entities/lead.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AgentBuilderAssociation.name,
        schema: AgentBuilderAssociationSchema,
      },
      { name: Requirement.name, schema: RequirementSchema },
      { name: Lead.name, schema: LeadSchema },
    ]),
  ],
  providers: [VisibilityService],
  exports: [VisibilityService],
})
export class CommonModule {}
