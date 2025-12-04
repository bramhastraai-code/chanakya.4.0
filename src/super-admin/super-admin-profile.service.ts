import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SuperAdminProfile } from './entities/super-admin-profile.entity';
import { UpdateSuperAdminProfileDto } from './dto/update-super-admin-profile.dto';

@Injectable()
export class SuperAdminProfileService {
  constructor(
    @InjectModel(SuperAdminProfile.name)
    private superAdminProfileModel: Model<SuperAdminProfile>,
  ) {}

  async getProfile(userId: Types.ObjectId) {
    const profile = await this.superAdminProfileModel
      .findOne({ userId })
      .exec();
    if (!profile) {
      throw new NotFoundException('Super admin profile not found');
    }
    return profile;
  }

  async updateProfile(userId: Types.ObjectId, dto: UpdateSuperAdminProfileDto) {
    const profile = await this.superAdminProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Super admin profile not found');
    }
    Object.assign(profile, dto);
    await profile.save();
    return profile;
  }

  async updateProfileImage(userId: Types.ObjectId, imageUrl: string) {
    const profile = await this.superAdminProfileModel.findOneAndUpdate(
      { userId },
      { profileImage: imageUrl },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Super admin profile not found');
    }
    return { profileImage: profile.profileImage };
  }
}
