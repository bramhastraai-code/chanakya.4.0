import { Document, Types } from 'mongoose';
import { Customer } from 'src/customer/entities/customer.entity';
export declare enum UserBehaviorType {
    PAGE_VIEW = "page_view",
    CTA_CLICK = "cta_click"
}
export interface DeviceInfo {
    os: string;
    browser: string;
    deviceType: string;
}
export declare class UserBehavior extends Document {
    user: Types.ObjectId | Customer;
    userType?: 'new' | 'old';
    sessionId: string;
    fcmToken?: string;
    type: UserBehaviorType;
    pageUrl: string;
    pageTitle?: string;
    section: string;
    referrer?: string;
    ipAddress?: string;
    deviceInfo?: DeviceInfo;
    ctaId?: string;
    ctaType?: string;
    ctaText?: string;
    metadata?: Record<string, any>;
}
export declare const UserBehaviorSchema: import("mongoose").Schema<UserBehavior, import("mongoose").Model<UserBehavior, any, any, any, Document<unknown, any, UserBehavior, any, {}> & UserBehavior & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserBehavior, Document<unknown, {}, import("mongoose").FlatRecord<UserBehavior>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<UserBehavior> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
