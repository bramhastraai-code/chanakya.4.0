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
import { User } from 'src/user/entity/user.entity';
export declare class Builder extends Document {
    name: string;
    description: string;
    phone: string;
    fcmToken?: string;
    refreshToken: string;
    email: string;
    alternatePhone?: string;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    logo?: string;
    inquiries?: Types.Array<Types.ObjectId>;
    views?: number;
    since?: number;
    totalProject?: number;
    owner?: Customer;
    createdBy: User;
    updatedBy: User;
    createdAt: Date;
    updatedAt: Date;
    status: string;
}
export declare const BuilderSchema: import("mongoose").Schema<Builder, import("mongoose").Model<Builder, any, any, any, Document<unknown, any, Builder> & Builder & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Builder, Document<unknown, {}, import("mongoose").FlatRecord<Builder>> & import("mongoose").FlatRecord<Builder> & {
    _id: Types.ObjectId;
}>;
