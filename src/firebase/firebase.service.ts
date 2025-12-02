// src/notification/notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGatewayHandler } from '../websocket/websocket.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseAdmin } from './firebase.admin';
import { User } from 'src/core/entities/user.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly firebaseAdmin: FirebaseAdmin,
    private readonly webSocketGateway: WebSocketGatewayHandler,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
      const user = await this.userModel.findById(userId).select('fcmToken');
      console.log(
        `Sending notification to user ${userId} with FCM token: ${user?.fcmToken}`,
      );
      if (!user || !user.fcmToken) {
        this.logger.warn(`No FCM token found for user ${userId}`);
        return false;
      }

      const message = {
        token: user.fcmToken,
        notification: { title, body },
        data,
      };

      const response = await this.firebaseAdmin.messaging.send(message);
      this.logger.log(`Notification sent to ${userId}: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending notification to ${userId}`, error);
      return false;
    }
  }

  async sendToMultipleUsers(
    userIds: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
      const users = await this.userModel
        .find({ _id: { $in: userIds } })
        .select('fcmToken');

      const validTokens = users
        .filter((user) => user.fcmToken)
        .map((user) => user.fcmToken);

      if (validTokens.length === 0) {
        this.logger.warn('No valid FCM tokens found for the provided users');
        return false;
      }

      const message = {
        tokens: validTokens,
        notification: { title, body },
        data,
      };

      const response =
        await this.firebaseAdmin.messaging.sendEachForMulticast(message);
      this.logger.log(
        `Multicast notification sent: ${response.successCount} successful`,
      );
      return response;
    } catch (error) {
      this.logger.error('Error sending multicast notification', error);
      return false;
    }
  }

  async sendHybridNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    // Try WebSocket first
    const wsSuccess = this.webSocketGateway.sendNotificationToBroker(userId, {
      type: 'PUSH_NOTIFICATION',
      title,
      body,
      data,
    });

    if (!wsSuccess) {
      this.logger.log(
        `User ${userId} not connected via WebSocket, falling back to FCM`,
      );
      return this.sendPushNotification(userId, title, body, data);
    }

    // Also send FCM for mobile users
    await this.sendPushNotification(userId, title, body, data);
    return true;
  }

  async updateFcmToken(userId: string, token: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      fcmToken: token,
    });
    this.logger.log(`Updated FCM token for user ${userId}`);
  }
}
