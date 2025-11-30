import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionService } from './subscription.service';
import {
  SubscriptionController,
  AdminSubscriptionController,
} from './subscription.controller';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from './entities/subscription-plan.entity';
import {
  AgentSubscription,
  AgentSubscriptionSchema,
} from './entities/agent-subscription.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
      { name: AgentSubscription.name, schema: AgentSubscriptionSchema },
    ]),
  ],
  controllers: [SubscriptionController, AdminSubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
