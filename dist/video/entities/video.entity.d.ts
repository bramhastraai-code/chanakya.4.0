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
import { Document } from 'mongoose';
import { VideoSourceType, VideoStatus } from '../enums/video.enum';
export declare class Video extends Document {
    userId: string;
    title: string;
    description: string;
    sourceType: VideoSourceType;
    s3Key?: string;
    youtubeUrl?: string;
    status: VideoStatus;
    approvedAt?: Date;
    rejectedAt?: Date;
    rejectionReason?: string;
    earnings: number;
    projectId?: string;
    publicUrl?: string;
}
export declare const VideoSchema: import("mongoose").Schema<Video, import("mongoose").Model<Video, any, any, any, Document<unknown, any, Video> & Video & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Video, Document<unknown, {}, import("mongoose").FlatRecord<Video>> & import("mongoose").FlatRecord<Video> & {
    _id: import("mongoose").Types.ObjectId;
}>;
