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
export declare const AmenitySchema: import("mongoose").Schema<Amenity, import("mongoose").Model<Amenity, any, any, any, Document<unknown, any, Amenity, any, {}> & Amenity & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Amenity, Document<unknown, {}, import("mongoose").FlatRecord<Amenity>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Amenity> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
