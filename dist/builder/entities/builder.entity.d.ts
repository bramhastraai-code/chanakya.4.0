import { Document, Types } from 'mongoose';
import { User } from 'src/core/entities/user.entity';
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
    owner?: User;
    createdBy: User;
    updatedBy: User;
    createdAt: Date;
    updatedAt: Date;
    status: string;
}
export declare const BuilderSchema: import("mongoose").Schema<Builder, import("mongoose").Model<Builder, any, any, any, Document<unknown, any, Builder, any, {}> & Builder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Builder, Document<unknown, {}, import("mongoose").FlatRecord<Builder>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Builder> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
