// src/videos/videos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoStatus } from './enums/video.enum';
import { Video } from './entities/video.entity';
import { UpdateVideoStatusDto } from './dto/update-video-status.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private readonly videoModel: Model<Video>,
  ) {}

  async create(userId: string, createVideoDto: CreateVideoDto): Promise<Video> {
    const video = new this.videoModel({
      userId,
      ...createVideoDto,
      status: VideoStatus.PENDING,
      earnings: 0,
    });

    return video.save();
  }

  async findAllByUser(userId: string): Promise<Video[]> {
    return this.videoModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Video> {
    const video = await this.videoModel.findOne({ _id: id, userId }).exec();
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    return video;
  }

  async updateStatus(
    id: string,
    updateVideoStatusDto: UpdateVideoStatusDto,
  ): Promise<Video> {
    const updateData: any = {
      status: updateVideoStatusDto.status,
    };

    if (updateVideoStatusDto.status === VideoStatus.APPROVED) {
      updateData.approvedAt = new Date();
      updateData.rejectedAt = null;
      updateData.rejectionReason = null;
    } else if (updateVideoStatusDto.status === VideoStatus.REJECTED) {
      updateData.rejectedAt = new Date();
      updateData.approvedAt = null;
      updateData.rejectionReason = updateVideoStatusDto.rejectionReason;
    }

    const video = await this.videoModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }

  async calculateEarnings(userId: string): Promise<number> {
    const result = await this.videoModel.aggregate([
      {
        $match: {
          userId,
          status: VideoStatus.APPROVED,
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$earnings' },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalEarnings : 0;
  }
}
