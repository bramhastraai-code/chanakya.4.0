"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBehaviorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const UAParser = require("ua-parser-js");
const customer_entity_1 = require("../customer/entities/customer.entity");
const user_behavior_entity_1 = require("./entities/user-behavior.entity");
const moment_1 = require("moment");
let UserBehaviorService = class UserBehaviorService {
    constructor(userBehaviorModel, userModel) {
        this.userBehaviorModel = userBehaviorModel;
        this.userModel = userModel;
    }
    async trackEvent(trackingData, userAgent, ipAddress) {
        const user = await this.userModel.findById(trackingData.user);
        if (!user) {
            trackingData.user = null;
            trackingData.userType = 'new';
        }
        trackingData.deviceInfo = this.parseUserAgent(userAgent);
        trackingData.ipAddress = ipAddress;
        return this.userBehaviorModel.create(trackingData);
    }
    parseUserAgent(userAgent) {
        const parser = new UAParser.UAParser(userAgent);
        const result = parser.getResult();
        return {
            os: result.os.name || 'Unknown',
            browser: result.browser.name || 'Unknown',
            deviceType: result.device.type || 'desktop',
        };
    }
    async getDailyActivity(days = 30) {
        const startDate = (0, moment_1.default)().subtract(days, 'days').startOf('day');
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
        const cohortStart = (0, moment_1.default)().subtract(cohortSize, 'days').startOf('day');
        const cohortUsers = await this.userBehaviorModel.distinct('user', {
            type: 'page_view',
            createdAt: {
                $gte: cohortStart.toDate(),
                $lte: cohortStart.clone().add(cohortSize, 'days').toDate(),
            },
        });
        const retentionDays = [1, 3, 7, 14, 30];
        const retentionData = await Promise.all(retentionDays.map(async (days) => {
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
        }));
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
                duration: events.length > 0
                    ? (0, moment_1.default)(events[events.length - 1].timestamp).diff((0, moment_1.default)(events[0].timestamp), 'seconds')
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
};
exports.UserBehaviorService = UserBehaviorService;
exports.UserBehaviorService = UserBehaviorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_behavior_entity_1.UserBehavior.name)),
    __param(1, (0, mongoose_1.InjectModel)(customer_entity_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UserBehaviorService);
//# sourceMappingURL=user-behavior.service.js.map