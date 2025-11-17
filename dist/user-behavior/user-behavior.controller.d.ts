import { Request } from 'express';
import { UserBehaviorService } from './user-behavior.service';
import { UserBehavior } from './entities/user-behavior.entity';
import { Response } from 'src/common/interceptor/response.interface';
import { TrackUserBehaviorDto } from './dto/create-user-behavior.dto';
export declare class UserBehaviorController {
    private readonly trackingService;
    constructor(trackingService: UserBehaviorService);
    trackEvent(trackUserBehaviorDto: TrackUserBehaviorDto, req: Request): Promise<Response<UserBehavior>>;
    getDailyActivity(days?: number): Promise<Response<any>>;
    getUserRetention(cohortSize?: number): Promise<Response<any>>;
    getPopularPages(limit?: number): Promise<Response<any>>;
    getCtaPerformance(limit?: number): Promise<Response<any>>;
    getUserJourneys(limit?: number): Promise<Response<any>>;
    getDeviceBreakdown(): Promise<Response<any>>;
    getSectionEngagement(): Promise<Response<any>>;
}
