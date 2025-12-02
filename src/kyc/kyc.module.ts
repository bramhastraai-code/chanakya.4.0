import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentKycController, AdminKycController } from './kyc.controller';
import {
  KycSubmission,
  KycSubmissionSchema,
} from './entities/kyc-submission.entity';
import { KycDocument, KycDocumentSchema } from './entities/kyc-document.entity';
import { KycV1Service } from './kyc.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KycSubmission.name, schema: KycSubmissionSchema },
      { name: KycDocument.name, schema: KycDocumentSchema },
    ]),
  ],
  controllers: [AgentKycController, AdminKycController],
  providers: [KycV1Service],
  exports: [KycV1Service],
})
export class KycModule {}
