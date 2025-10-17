import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentInquiryService } from './agent-inquiry.service';
import { AgentInquiryController } from './agent-inquiry.controller';
import {
  AgentInquiry,
  AgentInquirySchema,
} from './entities/agent-inquiry.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AgentInquiry.name, schema: AgentInquirySchema },
    ]),
  ],
  controllers: [AgentInquiryController],
  providers: [AgentInquiryService],
  exports: [AgentInquiryService], // Exporting for use in other modules if needed
})
export class AgentInquiryModule {}
