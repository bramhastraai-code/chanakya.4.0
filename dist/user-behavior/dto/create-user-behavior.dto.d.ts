import { UserBehaviorType } from '../entities/user-behavior.entity';
export declare class DeviceInfoDto {
    os?: string;
    browser?: string;
    deviceType?: string;
}
export declare class TrackUserBehaviorDto {
    user: string;
    userType?: 'new' | 'old';
    sessionId: string;
    type: UserBehaviorType;
    fcmToken?: string;
    pageUrl: string;
    pageTitle?: string;
    section: string;
    referrer?: string;
    ipAddress?: string;
    deviceInfo?: DeviceInfoDto;
    ctaId?: string;
    ctaType?: string;
    ctaText?: string;
    metadata?: Record<string, any>;
}
export declare class UserBehaviorResponseDto {
    id: string;
    user: string;
    sessionId: string;
    type: UserBehaviorType;
    pageUrl: string;
    pageTitle?: string;
    section: string;
    referrer?: string;
    ipAddress?: string;
    deviceInfo?: DeviceInfoDto;
    ctaId?: string;
    ctaType?: string;
    ctaText?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
