import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortVideo } from './entities/short-video.entity';
import { CreateShortVideoDto } from './dto/create-short-video.dto';
import { UpdateShortVideoDto } from './dto/update-short-video.dto';

@Injectable()
export class ShortVideoService {
  constructor(
    @InjectModel(ShortVideo.name)
    private readonly shortVideoModel: Model<ShortVideo>,
  ) {}

  async create(createShortVideoDto: CreateShortVideoDto): Promise<ShortVideo> {
    try {
      const existingVideo = await this.shortVideoModel.findOne({
        videoUrl: createShortVideoDto.videoUrl,
      });
      if (existingVideo) {
        throw new ConflictException('Video with the same URL already exists.');
      }
      const createdVideo = new this.shortVideoModel(createShortVideoDto);
      return await createdVideo.save();
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateShortVideoDto: UpdateShortVideoDto,
  ): Promise<ShortVideo | null> {
    try {
      const updatedVideo = await this.shortVideoModel
        .findByIdAndUpdate(id, updateShortVideoDto, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (!updatedVideo) {
        throw new NotFoundException('Short video not found.');
      }
      return updatedVideo;
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string = 'priority',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery?: string,
  ): Promise<{
    shortVideos: ShortVideo[];
    totalPages: number;
    totalVideos: number;
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

      const totalVideos = await this.shortVideoModel.countDocuments(query);
      const totalPages = Math.ceil(totalVideos / size);

      const shortVideos = await this.shortVideoModel
        .find(query)
        .skip(skip)
        .limit(size)
        .sort({ [sortBy]: sortOrder })
        .exec();

      return {
        shortVideos,
        totalPages,
        totalVideos,
        pageSize: size,
        pageNumber: page,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<ShortVideo | null> {
    try {
      const shortVideo = await this.shortVideoModel
        .findById({ _id: id })
        .populate('associatedProject')
        .exec();
      if (!shortVideo) {
        throw new NotFoundException('Short video not found.');
      }
      return shortVideo;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<{ deletedCount: number }> {
    try {
      const result = await this.shortVideoModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException('Short video not found.');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the short video.',
      );
    }
  }

  async videoList(
    page: number,
    limit: number,
  ): Promise<{
    data: ShortVideo[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    // Fetch the total count of videos
    const total = await this.shortVideoModel.countDocuments();

    // Fetch the paginated list of short videos
    const data = await this.shortVideoModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'associatedProject', // The field in ShortVideo that references Project
        select:
          'thumbnail,projectName priceAverage priceMin priceMax address city state',
        populate: {
          path: 'builder', // Field referencing the Builder entity inside the Project
          select: 'name logo contactDetails', // Include desired builder fields
        }, // Fields to include from the Project
      })
      .exec();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async incrementStat(id: string, key: string): Promise<ShortVideo> {
    const validKeys = ['likes', 'shares', 'views']; // Define valid fields

    // Validate the key
    if (!validKeys.includes(key)) {
      throw new BadRequestException(`Invalid stat key: "${key}"`);
    }

    const shortVideo = await this.shortVideoModel.findById(id);

    if (!shortVideo) {
      throw new NotFoundException(`Short video with ID "${id}" not found.`);
    }

    // Increment the key by 1
    shortVideo[key] += 1;

    return shortVideo.save();
  }
}
