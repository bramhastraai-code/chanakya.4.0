import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { Lead, LeadSchema } from './entities/lead.entity';
import {
  LeadActivity,
  LeadActivitySchema,
} from './entities/lead-activity.entity';
import { LeadV1Service } from './services/lead-v1.service';
import { UserLeadsController } from './controllers/v1/customer-leads.controller';
import { AgentLeadsController } from './controllers/v1/agent-leads.controller';
import { AdminLeadsController } from './controllers/v1/admin-leads.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: LeadActivity.name, schema: LeadActivitySchema },
    ]),
    CommonModule,
  ],
  controllers: [
    LeadController,
    // V1 Controllers
    UserLeadsController,
    AgentLeadsController,
    AdminLeadsController,
  ],
  providers: [
    LeadService,
    // V1 Service
    LeadV1Service,
  ],
  exports: [LeadService, LeadV1Service],
})
export class LeadModule {}
