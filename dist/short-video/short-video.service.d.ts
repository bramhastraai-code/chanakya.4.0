import { Model } from 'mongoose';
import { ShortVideo } from './entities/short-video.entity';
import { CreateShortVideoDto } from './dto/create-short-video.dto';
import { UpdateShortVideoDto } from './dto/update-short-video.dto';
export declare class ShortVideoService {
    private readonly shortVideoModel;
    constructor(shortVideoModel: Model<ShortVideo>);
    create(createShortVideoDto: CreateShortVideoDto): Promise<ShortVideo>;
    update(id: string, updateShortVideoDto: UpdateShortVideoDto): Promise<ShortVideo | null>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string): Promise<{
        shortVideos: ShortVideo[];
        totalPages: number;
        totalVideos: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<ShortVideo | null>;
    remove(id: string): Promise<{
        deletedCount: number;
    }>;
    videoList(page: number, limit: number): Promise<{
        data: ShortVideo[];
        total: number;
        page: number;
        limit: number;
    }>;
    incrementStat(id: string, key: string): Promise<ShortVideo>;
}
