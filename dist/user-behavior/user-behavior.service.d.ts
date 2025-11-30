/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { Customer } from 'src/customer/entities/customer.entity';
import { UserBehavior } from './entities/user-behavior.entity';
import { TrackUserBehaviorDto } from './dto/create-user-behavior.dto';
export declare class UserBehaviorService {
    private userBehaviorModel;
    private userModel;
    constructor(userBehaviorModel: Model<UserBehavior>, userModel: Model<Customer>);
    trackEvent(trackingData: TrackUserBehaviorDto, userAgent: string, ipAddress: string): Promise<import("mongoose").Document<unknown, {}, UserBehavior> & UserBehavior & {
        _id: import("mongoose").Types.ObjectId;
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
