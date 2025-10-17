import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as UAParser from 'ua-parser-js';
import { Customer } from 'src/customer/entities/customer.entity';
import { UserBehavior } from './entities/user-behavior.entity';
import moment from 'moment';
import { TrackUserBehaviorDto } from './dto/create-user-behavior.dto';

@Injectable()
export class UserBehaviorService {
  constructor(
    @InjectModel(UserBehavior.name)
    private userBehaviorModel: Model<UserBehavior>,
    @InjectModel(Customer.name) private userModel: Model<Customer>,
  ) {}

  async trackEvent(
    trackingData: TrackUserBehaviorDto,
    userAgent: string,
    ipAddress: string,
  ) {
    const user = await this.userModel.findById(trackingData.user);
    if (!user) {
      trackingData.user = null;
      trackingData.userType = 'new'; // Set to null if user not found
    }

    trackingData.deviceInfo = this.parseUserAgent(userAgent);
    trackingData.ipAddress = ipAddress;
    return this.userBehaviorModel.create(trackingData);
  }

  private parseUserAgent(userAgent: string) {
    const parser = new UAParser.UAParser(userAgent);
    const result = parser.getResult();

    return {
      os: result.os.name || 'Unknown',
      browser: result.browser.name || 'Unknown',
      deviceType: result.device.type || 'desktop',
    };
  }

  async getDailyActivity(days = 30) {
    const startDate = moment().subtract(days, 'days').startOf('day');

    return this.userBehaviorModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate.toDate() },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalVisits: { $sum: 1 },
          uniqueUsers: { $addToSet: '$user' },
          pageViews: {
            $sum: {
              $cond: [{ $eq: ['$type', 'page_view'] }, 1, 0],
            },
          },
          ctaClicks: {
            $sum: {
              $cond: [{ $eq: ['$type', 'cta_click'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          date: '$_id',
          totalVisits: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          pageViews: 1,
          ctaClicks: 1,
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ]);
  }

  async calculateRetention(cohortSize = 7) {
    const cohortStart = moment().subtract(cohortSize, 'days').startOf('day');

    const cohortUsers = await this.userBehaviorModel.distinct('user', {
      type: 'page_view',
      createdAt: {
        $gte: cohortStart.toDate(),
        $lte: cohortStart.clone().add(cohortSize, 'days').toDate(),
      },
    });

    const retentionDays = [1, 3, 7, 14, 30];
    const retentionData = await Promise.all(
      retentionDays.map(async (days) => {
        const retainedUsers = await this.userBehaviorModel.distinct('user', {
          user: { $in: cohortUsers },
          type: 'page_view',
          createdAt: {
            $gte: cohortStart.clone().add(days, 'days').toDate(),
          },
        });

        return {
          days,
          retainedUsers: retainedUsers.length,
          retentionRate: (retainedUsers.length / cohortUsers.length) * 100,
        };
      }),
    );

    return {
      cohortSize,
      cohortUsers: cohortUsers.length,
      retentionData,
    };
  }

  async getPopularPages(limit = 10) {
    return this.userBehaviorModel.aggregate([
      { $match: { type: 'page_view' } },
      {
        $group: {
          _id: '$pageUrl',
          count: { $sum: 1 },
          pageTitle: { $first: '$pageTitle' },
          lastVisited: { $max: '$createdAt' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $project: {
          pageUrl: '$_id',
          count: 1,
          pageTitle: 1,
          lastVisited: 1,
          _id: 0,
        },
      },
    ]);
  }

  async getCtaPerformance(limit = 20) {
    return this.userBehaviorModel.aggregate([
      { $match: { type: 'cta_click' } },
      {
        $group: {
          _id: {
            ctaId: '$ctaId',
            pageUrl: '$pageUrl',
          },
          count: { $sum: 1 },
          ctaType: { $first: '$ctaType' },
          ctaText: { $first: '$ctaText' },
          lastClicked: { $max: '$createdAt' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $project: {
          ctaId: '$_id.ctaId',
          pageUrl: '$_id.pageUrl',
          count: 1,
          ctaType: 1,
          ctaText: 1,
          lastClicked: 1,
          _id: 0,
        },
      },
    ]);
  }

  async analyzeUserJourneys(limit = 50) {
    const sessions = await this.userBehaviorModel.aggregate([
      {
        $group: {
          _id: '$sessionId',
          userId: { $first: '$user' },
          startTime: { $min: '$createdAt' },
          events: { $push: '$$ROOT' },
        },
      },
      { $sort: { startTime: -1 } },
      { $limit: limit },
    ]);

    return sessions.map((session) => {
      const events = session.events
        .sort((a, b) => a.createdAt - b.createdAt)
        .filter((event) => event.type === 'page_view')
        .map((event) => ({
          pageUrl: event.pageUrl,
          pageTitle: event.pageTitle,
          timestamp: event.createdAt,
        }));

      return {
        sessionId: session._id,
        userId: session.userId,
        startTime: session.startTime,
        path: events,
        duration:
          events.length > 0
            ? moment(events[events.length - 1].timestamp).diff(
                moment(events[0].timestamp),
                'seconds',
              )
            : 0,
      };
    });
  }

  async getDeviceBreakdown() {
    return this.userBehaviorModel.aggregate([
      {
        $group: {
          _id: '$deviceInfo.deviceType',
          count: { $sum: 1 },
          osBreakdown: {
            $push: {
              os: '$deviceInfo.os',
              browser: '$deviceInfo.browser',
            },
          },
        },
      },
      {
        $project: {
          deviceType: '$_id',
          count: 1,
          osBreakdown: 1,
          _id: 0,
        },
      },
    ]);
  }

  async getSectionEngagement() {
    return this.userBehaviorModel.aggregate([
      {
        $group: {
          _id: '$section',
          totalVisits: { $sum: 1 },
          uniqueUsers: { $addToSet: '$user' },
          ctaClicks: {
            $sum: {
              $cond: [{ $eq: ['$type', 'cta_click'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          section: '$_id',
          totalVisits: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          ctaClicks: 1,
          ctr: { $divide: ['$ctaClicks', '$totalVisits'] },
          _id: 0,
        },
      },
      { $sort: { totalVisits: -1 } },
    ]);
  }
}
