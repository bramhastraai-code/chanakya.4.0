import { Property } from 'aws-sdk/clients/appflow';
import { Project } from 'aws-sdk/clients/kendra';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/entity/user.entity';
export declare class Saved extends Document {
    user: User;
    project?: Project;
    property?: Property;
    savedAt: Date;
    isActive: boolean;
}
export declare const SavedSchema: import("mongoose").Schema<Saved, import("mongoose").Model<Saved, any, any, any, Document<unknown, any, Saved, any, {}> & Saved & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Saved, Document<unknown, {}, import("mongoose").FlatRecord<Saved>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Saved> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
