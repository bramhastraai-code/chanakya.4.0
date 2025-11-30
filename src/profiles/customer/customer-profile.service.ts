import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserProfile } from './entities/customer-profile.entity';
import { UpdateUserProfileDto } from './dto/update-customer-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile.name)
    private customerProfileModel: Model<UserProfile>,
  ) {}

  async getProfile(userId: Types.ObjectId) {
    const profile = await this.customerProfileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return profile;
  }

  async updateProfile(userId: Types.ObjectId, dto: UpdateUserProfileDto) {
    const profile = await this.customerProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    Object.assign(profile, dto);
    await profile.save();
    return profile;
  }

  async updateProfileImage(userId: Types.ObjectId, imageUrl: string) {
    const profile = await this.customerProfileModel.findOneAndUpdate(
      { userId },
      { profileImage: imageUrl },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return { profileImage: profile.profileImage };
  }

  async addSavedSearch(userId: Types.ObjectId, searchQuery: string) {
    const profile = await this.customerProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    if (!profile.savedSearches.includes(searchQuery)) {
      profile.savedSearches.push(searchQuery);
      await profile.save();
    }
    return { savedSearches: profile.savedSearches };
  }

  async getSavedSearches(userId: Types.ObjectId) {
    const profile = await this.customerProfileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return { savedSearches: profile.savedSearches };
  }
}
