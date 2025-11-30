import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AgentProfile,
  AgentProfileSchema,
} from './entities/agent-profile.entity';
import { AgentProfileService } from './agent-profile.service';
import { AgentProfileController } from './agent-profile.controller';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AgentProfile.name, schema: AgentProfileSchema },
    ]),
  ],
  controllers: [AgentProfileController],
  providers: [AgentProfileService, S3Service],
  exports: [AgentProfileService],
})
export class AgentProfileModule {}
