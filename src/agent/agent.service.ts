import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/core/entities/user.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { AgentSubscription } from './entities/agent-subscription.entity';
import { AgentStats } from './entities/agent-stats.entity';
import {
  UpdateProfileDto,
  UpdateSocialLinksDto,
  UpdateWebsiteDto,
  UpdateBusinessInfoDto,
} from './dto/update-profile.dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SubscriptionPlan.name)
    private planModel: Model<SubscriptionPlan>,
    @InjectModel(AgentSubscription.name)
    private agentSubscriptionModel: Model<AgentSubscription>,
    @InjectModel(AgentStats.name) private agentStatsModel: Model<AgentStats>,
  ) {}

  async getDashboardStats(agentId: string) {
    const stats = await this.agentStatsModel
      .findOne({ agent: agentId })
      .lean()
      .exec();
    if (!stats) {
      // return zeroed stats
      return { views: 0, retwines: 0, leads: 0, calls: 0 };
    }
    return stats;
  }

  async getListingsSummary(agentId: string) {
    // basic summary counts from customer listings (stubbed)
    // For now, return placeholders; ideally query property collection with owner/agent field.
    return {
      total: 0,
      rental: 0,
      resell: 0,
      projects: 0,
    };
  }

  async getProfile(agentId: string) {
    const agent = await this.userModel
      .findById(agentId)
      .select('-password -refreshToken')
      .lean()
      .exec();
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async updateProfile(agentId: string, updateDto: UpdateProfileDto) {
    const agent = await this.userModel.findById(agentId);

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    // Update fields
    if (updateDto.name) agent.name = updateDto.name;
    if (updateDto.email) agent.email = updateDto.email;
    if (updateDto.phoneNumber) agent.phoneNumber = updateDto.phoneNumber;
    if (updateDto.gender) agent.gender = updateDto.gender;
    if (updateDto.dateOfBirth) agent.DOB = new Date(updateDto.dateOfBirth);
    if (updateDto.location) {
      // Parse location if it's in "City, State" format
      const [city, state] = updateDto.location.split(',').map((s) => s.trim());
      if (city) agent.city = city;
      if (state) agent.state = state;
    }

    await agent.save();

    // Remove sensitive fields
    const agentObj = agent.toObject();
    // password field may not exist, so check before deleting
    if ('password' in agentObj) {
      delete agentObj.password;
    }
    if ('refreshToken' in agentObj) {
      delete agentObj.refreshToken;
    }
    return agentObj;
  }

  /**
   * Update social media links
   */
  async updateSocialLinks(
    agentId: string,
    socialLinksDto: UpdateSocialLinksDto,
  ) {
    const agent = await this.userModel.findById(agentId);

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    // Initialize socialMedia object if it doesn't exist
    if (!agent.socialMedia) {
      agent.socialMedia = {};
    }

    // Update social media links
    if (socialLinksDto.facebook)
      agent.socialMedia.facebook = socialLinksDto.facebook;
    if (socialLinksDto.instagram)
      agent.socialMedia.instagram = socialLinksDto.instagram;
    if (socialLinksDto.twitter)
      agent.socialMedia.twitter = socialLinksDto.twitter;
    if (socialLinksDto.linkedin)
      agent.socialMedia.linkedin = socialLinksDto.linkedin;
    if (socialLinksDto.youtube)
      agent.socialMedia.youtube = socialLinksDto.youtube;

    await agent.save();

    return {
      socialMedia: agent.socialMedia,
    };
  }

  /**
   * Update website URL
   */
  async updateWebsite(agentId: string, websiteDto: UpdateWebsiteDto) {
    const agent = await this.userModel.findByIdAndUpdate(
      agentId,
      { websiteUrl: websiteDto.websiteUrl },
      { new: true },
    );

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return {
      websiteUrl: agent.websiteUrl,
    };
  }

  /**
   * Update business information
   */
  async updateBusinessInfo(
    agentId: string,
    businessDto: UpdateBusinessInfoDto,
  ) {
    const agent = await this.userModel.findById(agentId);

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    // Update business fields
    if (businessDto.licenseNumber)
      agent.licenseNumber = businessDto.licenseNumber;
    if (businessDto.yearsOfExperience !== undefined) {
      agent.yearsOfExperience = businessDto.yearsOfExperience;
    }
    if (businessDto.agencyName) agent.agencyName = businessDto.agencyName;
    if (businessDto.teamSize !== undefined)
      agent.teamSize = businessDto.teamSize;
    if (businessDto.specializations)
      agent.specializations = businessDto.specializations;
    if (businessDto.serviceAreas) agent.serviceAreas = businessDto.serviceAreas;

    await agent.save();

    return {
      licenseNumber: agent.licenseNumber,
      yearsOfExperience: agent.yearsOfExperience,
      agencyName: agent.agencyName,
      teamSize: agent.teamSize,
      specializations: agent.specializations,
      serviceAreas: agent.serviceAreas,
    };
  }

  /**
   * Upload profile image
   */
  async updateProfileImage(agentId: string, imageUrl: string) {
    const agent = await this.userModel.findByIdAndUpdate(
      agentId,
      { profileImage: imageUrl },
      { new: true },
    );

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return {
      profileImage: agent.profileImage,
    };
  }

  // Subscriptions
  async getPlans() {
    return this.planModel.find({ isActive: true }).lean().exec();
  }

  async getCurrentSubscription(agentId: string) {
    return this.agentSubscriptionModel
      .findOne({ agent: agentId, status: 'active' })
      .populate('plan')
      .lean()
      .exec();
  }

  async purchaseSubscription(agentId: string, planId: string) {
    const plan = await this.planModel.findById(planId).exec();
    if (!plan) throw new NotFoundException('Plan not found');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + (plan.duration || 30));

    const subscription = await this.agentSubscriptionModel.create({
      agent: agentId,
      plan: plan._id,
      startDate,
      endDate,
      status: 'active',
      amount: plan.price,
    });

    // update customer subscription fields
    await this.userModel.findByIdAndUpdate(agentId, {
      subscriptionPlan: plan._id,
      subscriptionExpiry: endDate,
    });

    return subscription;
  }
}
