import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RazorpayModule } from 'nestjs-razorpay';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
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
import { CustomerAuthModule } from './customer-auth/customer-auth.module';
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
    UserModule,
    AuthModule,
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
    CustomerAuthModule,
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
  ],
})
export class AppModule {}
