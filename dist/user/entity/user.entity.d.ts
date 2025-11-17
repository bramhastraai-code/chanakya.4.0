import { Document, Types } from 'mongoose';
import { Role } from 'src/role/entity/role.entity';
export type UserDocument = User & Document;
export declare class User {
    userId: string;
    userImage: string;
    password: string;
    refreshToken: string;
    email: string;
    name: string;
    contactNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    role: Role;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    updatedBy: User;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
