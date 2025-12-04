import { Module } from '@nestjs/common';
import { BuilderService } from './builder.service';
import {
  BuilderController,
  BuilderAdminController,
} from './builder.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/core/entities/user.entity';
import {
  BuilderProfile,
  BuilderProfileSchema,
} from './entities/builder-profile.entity';
import {
  Property,
  PropertySchema,
} from 'src/property/entities/property.entity';
import { Project, ProjectSchema } from 'src/project/entities/project.entity';
import { Inquiry, InquirySchema } from 'src/inquiry/entities/inquiry.entity';
import { Bounty, BountySchema } from 'src/bounty/entities/bounty.entity';
import { S3Service } from 'src/s3/s3.service';
import { AgentModule } from 'src/agent/agent.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: BuilderProfile.name, schema: BuilderProfileSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Inquiry.name, schema: InquirySchema },
      { name: Bounty.name, schema: BountySchema },
    ]),
    AgentModule,
  ],
  controllers: [BuilderController, BuilderAdminController],
  providers: [BuilderService, S3Service],
  exports: [BuilderService],
})
export class BuilderModule {}
