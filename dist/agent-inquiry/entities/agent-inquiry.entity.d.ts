import { Document } from 'mongoose';
export declare class AgentInquiry extends Document {
    name?: string;
    email?: string;
    phoneNumber: string;
    YearOfExperience: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AgentInquirySchema: import("mongoose").Schema<AgentInquiry, import("mongoose").Model<AgentInquiry, any, any, any, Document<unknown, any, AgentInquiry, any, {}> & AgentInquiry & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AgentInquiry, Document<unknown, {}, import("mongoose").FlatRecord<AgentInquiry>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<AgentInquiry> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
