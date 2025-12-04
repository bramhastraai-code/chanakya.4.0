import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User, UserSchema } from './entities/user.entity';
import { Otp, OtpSchema } from './entities/otp.entity';
import {
  AgentProfile,
  AgentProfileSchema,
} from '../agent/entities/agent-profile.entity';
import {
  BuilderProfile,
  BuilderProfileSchema,
} from '../builder/entities/builder-profile.entity';
import {
  UserProfile,
  UserProfileSchema,
} from 'src/customer/entities/customer-profile.entity';
import {
  SuperAdminProfile,
  SuperAdminProfileSchema,
} from 'src/super-admin/entities/super-admin-profile.entity';

import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ProfileFactory } from './services/profile-factory.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { BrevoEmailService } from 'src/common/services/brevo-email.service';

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
  controllers: [AuthController],
  providers: [AuthService, ProfileFactory, JwtStrategy, BrevoEmailService],
  exports: [AuthService, ProfileFactory, BrevoEmailService],
})
export class CoreModule {}
