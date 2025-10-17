import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<Banner>,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    try {
      const createdBanner = new this.bannerModel(createBannerDto);
      return createdBanner.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the  banner.',
      );
    }
  }

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery?: string,
    isActive?: boolean,
  ): Promise<{
    banners: Banner[];
    totalPages: number;
    totalBanners: number;
    pageSize: number;
    pageNumber: number;
  }> {
    try {
      const size = parseInt(pageSize, 10) || 10;
      const page = parseInt(pageNumber, 10) || 1;
      const skip = (page - 1) * size;

      const query: any = {};
      if (searchQuery) {
        query.$or = [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ];
      }
      if (isActive !== undefined) {
        query.isActive = isActive;
      }

      const totalBanners = await this.bannerModel.countDocuments(query);
      const totalPages = Math.ceil(totalBanners / size);

      const banners = await this.bannerModel
        .find(query)
        .skip(skip)
        .limit(size)
        .sort({ [sortBy]: sortOrder });

      return {
        banners,
        totalBanners,
        totalPages,
        pageSize: size,
        pageNumber: page,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving  banners.',
      );
    }
  }

  async findOne(id: string): Promise<Banner> {
    try {
      const banner = await this.bannerModel.findById(id).exec();
      if (!banner) {
        throw new NotFoundException(' banner not found');
      }
      return banner;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the  banner.',
      );
    }
  }

  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    try {
      const updatedBanner = await this.bannerModel
        .findByIdAndUpdate(id, { $set: updateBannerDto }, { new: true })
        .exec();

      if (!updatedBanner) {
        throw new NotFoundException(' banner not found');
      }

      return updatedBanner;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the  banner.',
      );
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.bannerModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(' banner not found');
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the  banner.',
      );
    }
  }
  async getActiveBanners(): Promise<Banner[]> {
    const currentDate = new Date();
    return this.bannerModel
      .find({
        isActive: true,
        $or: [
          { startDate: { $lte: currentDate }, endDate: { $gte: currentDate } },
          { startDate: { $exists: false }, endDate: { $exists: false } },
        ],
      })
      .exec();
  }
}
