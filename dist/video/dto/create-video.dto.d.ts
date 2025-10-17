import { VideoSourceType } from '../enums/video.enum';
export declare class CreateVideoDto {
    title: string;
    description?: string;
    sourceType: VideoSourceType;
    s3Key?: string;
    youtubeUrl?: string;
    projectId?: string;
}
