import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RazorpayModule } from 'nestjs-razorpay';

// import { RoleModule } from './role/role.module';
import { PropertyModule } from './property/property.module';
import { ProjectModule } from './project/project.module';
import { AmenityModule } from './amenity/amenity.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { MulterModule } from '@nestjs/platform-express';
import { BuilderModule } from './builder/builder.module';
import { SearchFilterModule } from './search-filter/search-filter.module';
import { S3Module } from './s3/s3.module';
import { WebsocketModule } from './websocket/websocket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FirebaseModule } from './firebase/firebase.module';
import { NotificationModule } from './notification/notification.module';

// Phase 1-10: New V1 Modules
import { CoreModule } from './core/core.module';
import { AgentProfileModule } from './profiles/agent/agent-profile.module';
import { BuilderProfileModule } from './profiles/builder/builder-profile.module';
import { UserProfileModule } from './profiles/customer/customer-profile.module';
import { SuperAdminProfileModule } from './profiles/super-admin/super-admin-profile.module';
import { LeadModule } from './lead/lead.module';
import { RequirementModule } from './requirement/requirement.module';
import { BountyModule } from './bounty/bounty.module';
import { WalletModule } from './wallet/wallet.module';
import { KycModule } from './kyc/kyc.module';
import { AiModule } from './ai/ai.module';
import { WebsiteModule } from './website/website.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    RazorpayModule.forRoot({
      key_id: 'rzp_live_2FhwIdAriDpU2J',
      key_secret: 'GjfwZCuhU933hSd4Eh1QX5da',
    }),
    MulterModule.register({
      dest: './upload',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
    }),

    // Phase 1: Core & Auth
    CoreModule,

    // Phase 2: Profile Management
    AgentProfileModule,
    AgentModule,
    BuilderProfileModule,
    BuilderModule,
    UserProfileModule,
    SuperAdminProfileModule,

    // Phase 3-10: Feature Modules
    LeadModule,
    RequirementModule,
    BountyModule,
    WalletModule,
    KycModule,
    SubscriptionModule,
    DashboardModule,

    // Legacy modules (to be cleaned up)
    // RoleModule,
    PropertyModule,
    ProjectModule,
    AmenityModule,
    InquiryModule,

    SearchFilterModule,
    S3Module,
    WebsocketModule,
    ScheduleModule.forRoot(),
    FirebaseModule,
    NotificationModule,

    AiModule,
    WebsiteModule,
  ],
})
export class AppModule {}
