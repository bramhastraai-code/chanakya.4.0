import { VideoSourceType, VideoStatus } from '../enums/video.enum';
export declare class VideoResponseDto {
    id: string;
    userId: string;
    title: string;
    description: string;
    sourceType: VideoSourceType;
    s3Key?: string;
    youtubeUrl?: string;
    status: VideoStatus;
    publicUrl: string;
    approvedAt?: Date;
    rejectedAt?: Date;
    rejectionReason?: string;
    earnings: number;
    projectId?: string;
    createdAt: Date;
    updatedAt: Date;
}
