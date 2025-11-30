import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { AgentStats, AgentStatsSchema } from './entities/agent-stats.entity';
import { ChatHistory, ChatHistorySchema } from './entities/chat-history.entity';
import { Property, PropertySchema } from 'src/property/entities/property.entity';
import { Lead, LeadSchema } from 'src/lead/entities/lead.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AgentStats.name, schema: AgentStatsSchema },
      { name: ChatHistory.name, schema: ChatHistorySchema },
      { name: Property.name, schema: PropertySchema },
      { name: Lead.name, schema: LeadSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
