import { Document, Schema as MongooseSchema } from 'mongoose';
import { Project } from 'src/project/entities/project.entity';
import { Status } from 'src/common/enum/status.enum';
export declare class ShortVideo extends Document {
    videoUrl: string;
    thumbnail?: string;
    title?: string;
    description?: string;
    views: number;
    likes: number;
    shares: number;
    associatedProject: Project;
    priority: number;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ShortVideoSchema: MongooseSchema<ShortVideo, import("mongoose").Model<ShortVideo, any, any, any, Document<unknown, any, ShortVideo, any, {}> & ShortVideo & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ShortVideo, Document<unknown, {}, import("mongoose").FlatRecord<ShortVideo>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ShortVideo> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
