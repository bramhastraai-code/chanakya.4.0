import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BuilderProfile } from './entities/builder-profile.entity';
import {
  UpdateBuilderProfileDto,
  UpdateBuilderSocialLinksDto,
} from './dto/update-builder-profile.dto';

@Injectable()
export class BuilderProfileService {
  constructor(
    @InjectModel(BuilderProfile.name)
    private builderProfileModel: Model<BuilderProfile>,
  ) {}

  async getProfile(userId: Types.ObjectId) {
    const profile = await this.builderProfileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException('Builder profile not found');
    }
    return profile;
  }

  async updateProfile(userId: Types.ObjectId, dto: UpdateBuilderProfileDto) {
    const profile = await this.builderProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Builder profile not found');
    }
    Object.assign(profile, dto);
    await profile.save();
    return profile;
  }

  async updateSocialLinks(
    userId: Types.ObjectId,
    dto: UpdateBuilderSocialLinksDto,
  ) {
    const profile = await this.builderProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Builder profile not found');
    }
    if (!profile.socialLinks) {
      profile.socialLinks = {};
    }
    profile.socialLinks = { ...profile.socialLinks, ...dto };
    await profile.save();
    return { socialLinks: profile.socialLinks };
  }

  async updateCompanyLogo(userId: Types.ObjectId, logoUrl: string) {
    const profile = await this.builderProfileModel.findOneAndUpdate(
      { userId },
      { companyLogo: logoUrl },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Builder profile not found');
    }
    return { companyLogo: profile.companyLogo };
  }

  async getStatistics(userId: Types.ObjectId) {
    const profile = await this.builderProfileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException('Builder profile not found');
    }
    return {
      totalProjects: profile.totalProjects,
      ongoingProjects: profile.ongoingProjects,
      completedProjects: profile.completedProjects,
      rating: profile.rating,
      isVerified: profile.isVerified,
    };
  }
}
