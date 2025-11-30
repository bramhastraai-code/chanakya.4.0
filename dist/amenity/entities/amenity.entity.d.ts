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
import { User } from 'aws-sdk/clients/budgets';
import { Document, Types } from 'mongoose';
export declare class Amenity extends Document {
    name: string;
    iconImage: string;
    createdBy: User;
    updatedBy: User;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AmenitySchema: import("mongoose").Schema<Amenity, import("mongoose").Model<Amenity, any, any, any, Document<unknown, any, Amenity> & Amenity & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Amenity, Document<unknown, {}, import("mongoose").FlatRecord<Amenity>> & import("mongoose").FlatRecord<Amenity> & {
    _id: Types.ObjectId;
}>;
