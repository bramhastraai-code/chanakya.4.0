import { Model } from 'mongoose';
import { Customer } from 'src/customer/entities/customer.entity';
import { UserBehavior } from './entities/user-behavior.entity';
import { TrackUserBehaviorDto } from './dto/create-user-behavior.dto';
export declare class UserBehaviorService {
    private userBehaviorModel;
    private userModel;
    constructor(userBehaviorModel: Model<UserBehavior>, userModel: Model<Customer>);
    trackEvent(trackingData: TrackUserBehaviorDto, userAgent: string, ipAddress: string): Promise<import("mongoose").Document<unknown, {}, UserBehavior, {}, {}> & UserBehavior & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    private parseUserAgent;
    getDailyActivity(days?: number): Promise<any[]>;
    calculateRetention(cohortSize?: number): Promise<{
        cohortSize: number;
        cohortUsers: number;
        retentionData: {
            days: number;
            retainedUsers: number;
            retentionRate: number;
        }[];
    }>;
    getPopularPages(limit?: number): Promise<any[]>;
    getCtaPerformance(limit?: number): Promise<any[]>;
    analyzeUserJourneys(limit?: number): Promise<{
        sessionId: any;
        userId: any;
        startTime: any;
        path: any;
        duration: number;
    }[]>;
    getDeviceBreakdown(): Promise<any[]>;
    getSectionEngagement(): Promise<any[]>;
}
