import { Module } from '@nestjs/common';
import { FirebaseController } from './firebase.controller';
import { FirebaseAdmin } from './firebase.admin';
import { NotificationService } from './firebase.service';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/core/entities/user.entity';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [
    WebsocketModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [FirebaseController],
  providers: [NotificationService, FirebaseAdmin],
  exports: [NotificationService, FirebaseAdmin],
})
export class FirebaseModule {}
