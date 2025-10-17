// tracking.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserBehavior,
  UserBehaviorSchema,
} from './entities/user-behavior.entity';
import {
  Customer,
  CustomerSchema,
} from 'src/customer/entities/customer.entity';
import { UserBehaviorController } from './user-behavior.controller';
import { UserBehaviorService } from './user-behavior.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserBehavior.name, schema: UserBehaviorSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [UserBehaviorController],
  providers: [UserBehaviorService],
  exports: [UserBehaviorService],
})
export class UserBehaviorModule {}
