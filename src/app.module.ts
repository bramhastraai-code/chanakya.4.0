import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RazorpayModule } from 'nestjs-razorpay';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PropertyModule } from './property/property.module';
import { ProjectModule } from './project/project.module';
import { BannerModule } from './banner/banner.module';
import { AmenityModule } from './amenity/amenity.module';
import { SavedModule } from './saved/saved.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { BlogModule } from './blog/blog.module';
import { CustomerModule } from './customer/customer.module';
import { MulterModule } from '@nestjs/platform-express';
import { BuilderModule } from './builder/builder.module';
import { SearchFilterModule } from './search-filter/search-filter.module';
import { S3Module } from './s3/s3.module';
import { OrderModule } from './order/order.module';
import { PlanModule } from './plan/plan.module';
import { ShortVideoModule } from './short-video/short-video.module';
import { AgentInquiryModule } from './agent-inquiry/agent-inquiry.module';
import { WebsocketModule } from './websocket/websocket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FirebaseModule } from './firebase/firebase.module';
import { UserBehaviorModule } from './user-behavior/user-behavior.module';
import { VideoModule } from './video/video.module';
import { AgentModule } from './agent/agent.module';
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
    BuilderProfileModule,
    UserProfileModule,
    SuperAdminProfileModule,

    // Phase 3-10: Feature Modules
    LeadModule,
    RequirementModule,
    BountyModule,
    WalletModule,
    KycModule,
    AiModule,
    WebsiteModule,
    SubscriptionModule,
    DashboardModule,

    // Legacy modules (to be cleaned up)
    UserModule,
    RoleModule,
    PropertyModule,
    ProjectModule,
    BannerModule,
    AmenityModule,
    SavedModule,
    InquiryModule,
    BlogModule,
    CustomerModule,
    BuilderModule,
    SearchFilterModule,
    S3Module,
    OrderModule,
    PlanModule,
    ShortVideoModule,
    AgentInquiryModule,
    WebsocketModule,
    ScheduleModule.forRoot(),
    FirebaseModule,
    UserBehaviorModule,
    VideoModule,
    AgentModule,
    NotificationModule,
  ],
})
export class AppModule {}
