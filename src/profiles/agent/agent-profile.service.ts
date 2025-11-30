import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AgentProfile } from './entities/agent-profile.entity';
import {
  UpdateAgentProfileDto,
  UpdateSocialLinksDto,
  UpdateWebsiteDto,
} from './dto/update-agent-profile.dto';

@Injectable()
export class AgentProfileService {
  constructor(
    @InjectModel(AgentProfile.name)
    private agentProfileModel: Model<AgentProfile>,
  ) {}

  /**
   * Get agent profile by user ID
   */
  async getProfile(userId: Types.ObjectId) {
    const profile = await await this.agentProfileModel
      .findOne({ userId })
      .populate('userId', { strictPopulate: false })
      .exec();

    if (!profile) {
      throw new NotFoundException('Agent profile not found');
    }

    return profile;
  }

  /**
   * Update agent profile
   */
  async updateProfile(userId: Types.ObjectId, dto: UpdateAgentProfileDto) {
    const profile = await this.agentProfileModel.findOne({ userId });

    if (!profile) {
      throw new NotFoundException('Agent profile not found');
    }

    // Update fields
    Object.assign(profile, dto);
    await profile.save();

    return profile;
  }

  /**
   * Update social links
   */
  async updateSocialLinks(userId: Types.ObjectId, dto: UpdateSocialLinksDto) {
    const profile = await this.agentProfileModel.findOne({ userId });

    if (!profile) {
      throw new NotFoundException('Agent profile not found');
    }

    // Initialize socialLinks if doesn't exist
    if (!profile.socialLinks) {
      profile.socialLinks = {};
    }

    // Update social links
    profile.socialLinks = {
      ...profile.socialLinks,
      ...dto,
    };

    await profile.save();

    return {
      socialLinks: profile.socialLinks,
    };
  }

  /**
   * Update website URL
   */
  async updateWebsite(userId: Types.ObjectId, dto: UpdateWebsiteDto) {
    const profile = await this.agentProfileModel.findOneAndUpdate(
      { userId },
      { websiteUrl: dto.websiteUrl },
      { new: true },
    );

    if (!profile) {
      throw new NotFoundException('Agent profile not found');
    }

    return {
      websiteUrl: profile.websiteUrl,
    };
  }

  /**
   * Update profile image
   */
  async updateProfileImage(userId: Types.ObjectId, imageUrl: string) {
    const profile = await this.agentProfileModel.findOneAndUpdate(
      { userId },
      { profileImage: imageUrl },
      { new: true },
    );

    if (!profile) {
      throw new NotFoundException('Agent profile not found');
    }

    return {
      profileImage: profile.profileImage,
    };
  }

  /**
   * Get agent statistics
   */
  async getStatistics(userId: Types.ObjectId) {
    const profile = await this.agentProfileModel.findOne({ userId }).exec();

    if (!profile) {
      throw new NotFoundException('Agent profile not found');
    }

    return {
      walletBalance: profile.walletBalance,
      pendingEarnings: profile.pendingEarnings,
      lifetimeEarnings: profile.lifetimeEarnings,
      totalDeals: profile.totalDeals,
      activeListings: profile.activeListings,
      rating: profile.rating,
      isVerified: profile.isVerified,
      isKycVerified: profile.isKycVerified,
    };
  }
}
