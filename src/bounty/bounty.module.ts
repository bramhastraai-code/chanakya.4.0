import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bounty, BountySchema } from './entities/bounty.entity';
import {
  BountySubmission,
  BountySubmissionSchema,
} from './entities/bounty-submission.entity';
import { BountyService } from './bounty.service';
import { BountyController } from './bounty.controller';
import { WalletModule } from '../wallet/wallet.module';
import { Project, ProjectSchema } from '../project/entities/project.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bounty.name, schema: BountySchema },
      { name: BountySubmission.name, schema: BountySubmissionSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
    WalletModule,
  ],
  controllers: [BountyController],
  providers: [BountyService],
  exports: [BountyService],
})
export class BountyModule {}
