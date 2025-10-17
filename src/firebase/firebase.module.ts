import { Module } from '@nestjs/common';
import { FirebaseController } from './firebase.controller';
import { FirebaseAdmin } from './firebase.admin';
import { NotificationService } from './firebase.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Customer,
  CustomerSchema,
} from 'src/customer/entities/customer.entity';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [
    WebsocketModule,
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [FirebaseController],
  providers: [NotificationService, FirebaseAdmin],
  exports: [NotificationService, FirebaseAdmin],
})
export class FirebaseModule {}
