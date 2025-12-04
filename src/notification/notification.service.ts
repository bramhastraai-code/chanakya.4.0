import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';
import { NotificationType } from './enum/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>,
  ): Promise<NotificationDocument> {
    const notification = new this.notificationModel({
      user: userId,
      type,
      title,
      message,
      data,
      isRead: false,
    });

    const savedNotification = await notification.save();

    // TODO: Send FCM push notification
    // await this.sendPushNotification(userId, title, message, data);

    return savedNotification;
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false,
  ) {
    const query: any = { user: userId };

    if (unreadOnly) {
      query.isRead = false;
    }

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      this.notificationModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(query),
      this.notificationModel.countDocuments({ user: userId, isRead: false }),
    ]);

    return {
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      unreadCount,
    };
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    await this.notificationModel.updateOne(
      { _id: id, user: userId },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { user: userId, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      user: userId,
      isRead: false,
    });
  }

  // Helper methods for creating specific notification types
  async notifyLeadReceived(
    agentId: string,
    leadId: string,
    customerName: string,
    propertyTitle: string,
  ): Promise<void> {
    await this.create(
      agentId,
      NotificationType.LEAD_RECEIVED,
      'New Lead Received',
      `${customerName} is interested in ${propertyTitle}`,
      { leadId, customerName, propertyTitle },
    );
  }

  async notifyPropertyApproved(
    agentId: string,
    propertyId: string,
    propertyTitle: string,
  ): Promise<void> {
    await this.create(
      agentId,
      NotificationType.PROPERTY_APPROVED,
      'Property Approved',
      `Your property "${propertyTitle}" has been approved`,
      { propertyId, propertyTitle },
    );
  }

  async notifyBountyReward(
    agentId: string,
    bountyId: string,
    amount: number,
  ): Promise<void> {
    await this.create(
      agentId,
      NotificationType.BOUNTY_REWARD,
      'Bounty Reward Earned',
      `You earned ₹${amount.toLocaleString('en-IN')} from bounty completion`,
      { bountyId, amount },
    );
  }

  async notifyKycApproved(userId: string): Promise<void> {
    await this.create(
      userId,
      NotificationType.KYC_APPROVED,
      'KYC Approved',
      'Your KYC verification has been approved',
    );
  }

  async notifyKycRejected(userId: string, reason: string): Promise<void> {
    await this.create(
      userId,
      NotificationType.KYC_REJECTED,
      'KYC Rejected',
      `Your KYC verification was rejected: ${reason}`,
      { reason },
    );
  }
}
