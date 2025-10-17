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
export declare class Inquiry extends Document {
    userId: Types.ObjectId | null;
    contactNumber?: string;
    title?: string;
    inquiryType: 'common' | 'groupBuy' | 'agentSelection' | 'quickBuy' | 'siteVisit';
    projectId?: Types.ObjectId | null;
    propertyId?: Types.ObjectId | null;
    message: string;
    about: string;
    siteVisitDate?: Date;
    siteVisitTime?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}
export declare const InquirySchema: import("mongoose").Schema<Inquiry, import("mongoose").Model<Inquiry, any, any, any, Document<unknown, any, Inquiry> & Inquiry & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Inquiry, Document<unknown, {}, import("mongoose").FlatRecord<Inquiry>> & import("mongoose").FlatRecord<Inquiry> & {
    _id: Types.ObjectId;
}>;
