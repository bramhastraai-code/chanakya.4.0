import { Status } from 'src/common/enum/status.enum';
export declare class CreateShortVideoDto {
    videoUrl?: string;
    thumbnail?: string;
    title?: string;
    description?: string;
    views?: number;
    likes?: number;
    shares?: number;
    priority?: number;
    status?: Status;
    associatedProject: string;
}
export declare class IncrementStatDto {
    key: string;
}
