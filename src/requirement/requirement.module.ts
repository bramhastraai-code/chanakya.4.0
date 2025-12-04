import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequirementService } from './requirement.service';
import {
  AgentRequirementController,
  UserRequirementController,
} from './requirement.controller';
import { Requirement, RequirementSchema } from './entities/requirement.entity';
import {
  RequirementMatch,
  RequirementMatchSchema,
} from './entities/requirement-match.entity';
import { Property, PropertySchema } from '../property/entities/property.entity';
import { RequirementV1Service } from './services/requirement-v1.service';
import { UserRequirementsController } from './controllers/v1/customer-requirements.controller';
import { AgentRequirementsController } from './controllers/v1/agent-requirements.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Requirement.name, schema: RequirementSchema },
      { name: RequirementMatch.name, schema: RequirementMatchSchema },
      { name: Property.name, schema: PropertySchema },
    ]),
    CommonModule,
  ],
  controllers: [
    AgentRequirementController,
    UserRequirementController,
    // V1 Controllers
    UserRequirementsController,
    AgentRequirementsController,
  ],
  providers: [
    RequirementService,
    // V1 Service
    RequirementV1Service,
  ],
  exports: [RequirementService, RequirementV1Service],
})
export class RequirementModule {}
