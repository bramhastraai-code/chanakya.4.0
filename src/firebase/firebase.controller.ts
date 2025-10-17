import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './firebase.service';

import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Response } from 'src/common/interceptor/response.interface';

@Controller('notifications')
@ApiTags('Firebase Notifications')
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a push notification to a single user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        title: { type: 'string' },
        body: { type: 'string' },
        data: { type: 'object', additionalProperties: { type: 'string' } },
      },
    },
  })
  async sendNotification(
    @Body('userId') userId: string,
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('data') data?: Record<string, string>,
  ) {
    return this.notificationService.sendPushNotification(
      userId,
      title,
      body,
      data,
    );
  }

  @Post('send-multiple')
  @ApiOperation({ summary: 'Send a push notification to multiple users' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userIds: { type: 'array', items: { type: 'string' } },
        title: { type: 'string' },
        body: { type: 'string' },
        data: { type: 'object', additionalProperties: { type: 'string' } },
      },
    },
  })
  async sendToMultipleUsers(
    @Body('userIds') userIds: string[],
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('data') data?: Record<string, string>,
  ) {
    return this.notificationService.sendToMultipleUsers(
      userIds,
      title,
      body,
      data,
    );
  }

  @Post('send-hybrid')
  @ApiOperation({ summary: 'Send a hybrid notification (WebSocket + FCM)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        title: { type: 'string' },
        body: { type: 'string' },
        data: { type: 'object', additionalProperties: { type: 'string' } },
      },
    },
  })
  async sendHybridNotification(
    @Body('userId') userId: string,
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('data') data?: Record<string, string>,
  ) {
    return this.notificationService.sendHybridNotification(
      userId,
      title,
      body,
      data,
    );
  }

  @Post('register')
  @ApiOperation({ summary: 'Update FCM token for a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        token: { type: 'string' },
      },
    },
  })
  async updateFcmToken(
    @Body('userId') userId: string,
    @Body('token') token: string,
  ): Promise<Response<any>> {
    const data = await this.notificationService.updateFcmToken(userId, token);
    return {
      data,
      message: 'FCM token updated successfully',
    };
  }
}
