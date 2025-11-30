import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import {
  User,
  UserSchema,
} from 'src/core/entities/user.entity';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from './entities/subscription-plan.entity';
import {
  AgentSubscription,
  AgentSubscriptionSchema,
} from './entities/agent-subscription.entity';
import { AgentStats, AgentStatsSchema } from './entities/agent-stats.entity';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
      { name: AgentSubscription.name, schema: AgentSubscriptionSchema },
      { name: AgentStats.name, schema: AgentStatsSchema },
    ]),
  ],
  controllers: [AgentController],
  providers: [AgentService, S3Service],
})
export class AgentModule {}
