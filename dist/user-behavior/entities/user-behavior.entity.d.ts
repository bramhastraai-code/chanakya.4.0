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
export declare const UserBehaviorSchema: import("mongoose").Schema<UserBehavior, import("mongoose").Model<UserBehavior, any, any, any, Document<unknown, any, UserBehavior> & UserBehavior & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserBehavior, Document<unknown, {}, import("mongoose").FlatRecord<UserBehavior>> & import("mongoose").FlatRecord<UserBehavior> & {
    _id: Types.ObjectId;
}>;
