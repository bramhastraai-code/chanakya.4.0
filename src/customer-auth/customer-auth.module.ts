import { Module } from '@nestjs/common';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerAuthController } from './customer-auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Customer,
  CustomerSchema,
} from 'src/customer/entities/customer.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtStrategy } from './strategy/jwt.strategy';
import { Otp, OtpSchema } from './entity/otp.entity';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [CustomerAuthController],
  providers: [CustomerAuthService, jwtStrategy, CustomerService],
})
export class CustomerAuthModule {}
