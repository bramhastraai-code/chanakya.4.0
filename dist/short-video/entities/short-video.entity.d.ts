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
export declare const ShortVideoSchema: MongooseSchema<ShortVideo, import("mongoose").Model<ShortVideo, any, any, any, Document<unknown, any, ShortVideo> & ShortVideo & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ShortVideo, Document<unknown, {}, import("mongoose").FlatRecord<ShortVideo>> & import("mongoose").FlatRecord<ShortVideo> & {
    _id: import("mongoose").Types.ObjectId;
}>;
