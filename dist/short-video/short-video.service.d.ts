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
