import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User, UserSchema } from './entities/user.entity';
import { Otp, OtpSchema } from './entities/otp.entity';
import {
  AgentProfile,
  AgentProfileSchema,
} from 'src/profiles/agent/entities/agent-profile.entity';
import {
  BuilderProfile,
  BuilderProfileSchema,
} from 'src/profiles/builder/entities/builder-profile.entity';
import {
  UserProfile,
  UserProfileSchema,
} from 'src/profiles/customer/entities/customer-profile.entity';
import {
  SuperAdminProfile,
  SuperAdminProfileSchema,
} from 'src/profiles/super-admin/entities/super-admin-profile.entity';

import { UnifiedAuthService } from './auth/unified-auth.service';
import { UnifiedAuthController } from './auth/unified-auth.controller';
import { ProfileFactory } from './services/profile-factory.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: AgentProfile.name, schema: AgentProfileSchema },
      { name: BuilderProfile.name, schema: BuilderProfileSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: SuperAdminProfile.name, schema: SuperAdminProfileSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'abc',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UnifiedAuthController],
  providers: [UnifiedAuthService, ProfileFactory, JwtStrategy],
  exports: [UnifiedAuthService, ProfileFactory],
})
export class CoreModule {}
