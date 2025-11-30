import { Document, Types } from 'mongoose';
export declare class Inquiry extends Document {
    email?: string;
    name?: string;
    phone?: string;
    companyname?: string;
    title?: string;
    inquiryType: 'common' | 'groupBuy' | 'agentSelection' | 'quickBuy' | 'siteVisit' | 'loan' | 'advisory';
    projectId?: Types.ObjectId | null;
    propertyId?: Types.ObjectId | null;
    message: string;
    about: string;
    siteVisitDate?: Date;
    siteVisitTime?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}
export declare const InquirySchema: import("mongoose").Schema<Inquiry, import("mongoose").Model<Inquiry, any, any, any, Document<unknown, any, Inquiry, any, {}> & Inquiry & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Inquiry, Document<unknown, {}, import("mongoose").FlatRecord<Inquiry>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Inquiry> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
