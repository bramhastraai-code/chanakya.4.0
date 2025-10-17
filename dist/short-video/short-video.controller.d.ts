import { ShortVideoService } from './short-video.service';
import { ShortVideo } from './entities/short-video.entity';
import { CreateShortVideoDto } from './dto/create-short-video.dto';
import { UpdateShortVideoDto } from './dto/update-short-video.dto';
import { Response } from 'src/common/interceptor/response.interface';
export declare class ShortVideoController {
    private readonly shortVideoService;
    constructor(shortVideoService: ShortVideoService);
    create(createShortVideoDto: CreateShortVideoDto): Promise<Response<ShortVideo>>;
    update(id: string, updateShortVideoDto: UpdateShortVideoDto): Promise<Response<ShortVideo>>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string): Promise<Response<{
        shortVideos: ShortVideo[];
        totalPages: number;
        totalVideos: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<ShortVideo>>;
    remove(id: string): Promise<void>;
    getVideoList(page?: number, limit?: number): Promise<{
        data: {
            data: ShortVideo[];
            total: number;
            page: number;
            limit: number;
        };
        message: string;
    }>;
    incrementStat(id: string, key: 'views' | 'likes' | 'shares'): Promise<{
        data: ShortVideo;
        message: string;
    }>;
}
