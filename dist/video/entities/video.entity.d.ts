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
export declare const VideoSchema: import("mongoose").Schema<Video, import("mongoose").Model<Video, any, any, any, Document<unknown, any, Video, any, {}> & Video & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Video, Document<unknown, {}, import("mongoose").FlatRecord<Video>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Video> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
