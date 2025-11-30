import { Model } from 'mongoose';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannerService {
    private readonly bannerModel;
    constructor(bannerModel: Model<Banner>);
    create(createBannerDto: CreateBannerDto): Promise<Banner>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, isActive?: boolean): Promise<{
        banners: Banner[];
        totalPages: number;
        totalBanners: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Banner>;
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner>;
    remove(id: string): Promise<boolean>;
    getActiveBanners(): Promise<Banner[]>;
}
