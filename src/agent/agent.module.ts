import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/core/entities/user.entity';
import {
  AgentProfile,
  AgentProfileSchema,
} from './entities/agent-profile.entity';

import { S3Module } from 'src/s3/s3.module';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from 'src/subscription/entities/subscription-plan.entity';
import {
  AgentSubscription,
  AgentSubscriptionSchema,
} from 'src/subscription/entities/agent-subscription.entity';
import {
  AgentStats,
  AgentStatsSchema,
} from './entities/agent-stats.entity';
import { Property, PropertySchema } from 'src/property/entities/property.entity';
import { Project, ProjectSchema } from 'src/project/entities/project.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AgentProfile.name, schema: AgentProfileSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
      { name: AgentSubscription.name, schema: AgentSubscriptionSchema },
      { name: AgentStats.name, schema: AgentStatsSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
    S3Module,
  ],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
