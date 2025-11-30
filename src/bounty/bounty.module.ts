import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bounty, BountySchema } from './entities/bounty.entity';
import {
  BountySubmission,
  BountySubmissionSchema,
} from './entities/bounty-submission.entity';
import { BountyV1Service } from './services/bounty-v1.service';
import { UserBountyController } from './controllers/v1/user-bounty.controller';
import { AdminBountyController } from './controllers/v1/admin-bounty.controller';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bounty.name, schema: BountySchema },
      { name: BountySubmission.name, schema: BountySubmissionSchema },
    ]),
    WalletModule,
  ],
  controllers: [UserBountyController, AdminBountyController],
  providers: [BountyV1Service],
  exports: [BountyV1Service],
})
export class BountyModule {}
