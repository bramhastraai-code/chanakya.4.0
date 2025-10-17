import { CreateBannerDto } from './dto/create-banner.dto';
import { Banner } from './entities/banner.entity';
import { Response } from 'src/common/interceptor/response.interface';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannerService } from './banner.service';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    create(createBannerDto: CreateBannerDto): Promise<Response<Banner>>;
    findAll(pageSize?: string, pageNumber?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, isActive?: boolean): Promise<Response<{
        banners: Banner[];
        totalPages: number;
        totalBanners: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<Banner>>;
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner>;
    remove(id: string): Promise<void>;
    getActiveBanners(): Promise<Banner[]>;
}
