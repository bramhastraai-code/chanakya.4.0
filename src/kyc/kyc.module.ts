import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KycService } from './kyc.service';
import {
  AgentKycController as LegacyAgentKycController,
  AdminKycController as LegacyAdminKycController,
} from './kyc.controller';
import {
  KycSubmission,
  KycSubmissionSchema,
} from './entities/kyc-submission.entity';
import { KycDocument, KycDocumentSchema } from './entities/kyc-document.entity';
import { KycV1Service } from './services/kyc-v1.service';
import { AgentKycController } from './controllers/v1/agent-kyc.controller';
import { AdminKycController } from './controllers/v1/admin-kyc.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KycSubmission.name, schema: KycSubmissionSchema },
      { name: KycDocument.name, schema: KycDocumentSchema },
    ]),
  ],
  controllers: [
    LegacyAgentKycController,
    LegacyAdminKycController,
    // V1 Controllers
    AgentKycController,
    AdminKycController,
  ],
  providers: [
    KycService,
    // V1 Service
    KycV1Service,
  ],
  exports: [KycService, KycV1Service],
})
export class KycModule {}
