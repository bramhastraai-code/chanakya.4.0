import { Model } from 'mongoose';
import { CreateVideoDto } from './dto/create-video.dto';
import { Video } from './entities/video.entity';
import { UpdateVideoStatusDto } from './dto/update-video-status.dto';
export declare class VideoService {
    private readonly videoModel;
    constructor(videoModel: Model<Video>);
    create(userId: string, createVideoDto: CreateVideoDto): Promise<Video>;
    findAllByUser(userId: string): Promise<Video[]>;
    findOne(id: string, userId: string): Promise<Video>;
    updateStatus(id: string, updateVideoStatusDto: UpdateVideoStatusDto): Promise<Video>;
    calculateEarnings(userId: string): Promise<number>;
}
