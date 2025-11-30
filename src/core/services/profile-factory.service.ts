import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRole } from 'src/common/enum/user-role.enum';
import { AgentProfile } from 'src/profiles/agent/entities/agent-profile.entity';
import { BuilderProfile } from 'src/profiles/builder/entities/builder-profile.entity';
import { UserProfile } from 'src/profiles/customer/entities/customer-profile.entity';
import { SuperAdminProfile } from 'src/profiles/super-admin/entities/super-admin-profile.entity';

@Injectable()
export class ProfileFactory {
  constructor(
    @InjectModel(AgentProfile.name)
    private agentProfileModel: Model<AgentProfile>,
    @InjectModel(BuilderProfile.name)
    private builderProfileModel: Model<BuilderProfile>,
    @InjectModel(UserProfile.name)
    private customerProfileModel: Model<UserProfile>,
    @InjectModel(SuperAdminProfile.name)
    private superAdminProfileModel: Model<SuperAdminProfile>,
  ) {}

  /**
   * Create profile based on user role
   */
  async createProfile(
    userId: Types.ObjectId,
    role: UserRole,
    additionalData: any,
  ) {
    switch (role) {
      case UserRole.AGENT:
        return await this.createAgentProfile(userId, additionalData);

      case UserRole.BUILDER:
        return await this.createBuilderProfile(userId, additionalData);

      case UserRole.CUSTOMER:
        return await this.createUserProfile(userId, additionalData);

      case UserRole.SUPER_ADMIN:
        return await this.createSuperAdminProfile(userId, additionalData);

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  /**
   * Get profile based on user role
   */
  async getProfile(userId: Types.ObjectId, role: UserRole) {
    switch (role) {
      case UserRole.AGENT:
        return await this.agentProfileModel.findOne({ userId }).exec();

      case UserRole.BUILDER:
        return await this.builderProfileModel.findOne({ userId }).exec();

      case UserRole.CUSTOMER:
        return await this.customerProfileModel.findOne({ userId }).exec();

      case UserRole.SUPER_ADMIN:
        return await this.superAdminProfileModel.findOne({ userId }).exec();

      default:
        return null;
    }
  }

  /**
   * Create agent profile
   */
  private async createAgentProfile(userId: Types.ObjectId, data: any) {
    const profile = new this.agentProfileModel({
      userId,
      name: data.name || '',
      company: data.company,
      city: data.city,
      state: data.state,
      languages: data.languages || ['English'],
    });

    return await profile.save();
  }

  /**
   * Create builder profile
   */
  private async createBuilderProfile(userId: Types.ObjectId, data: any) {
    const profile = new this.builderProfileModel({
      userId,
      companyName: data.companyName || data.name || '',
      contactPerson: data.name,
      address: {
        city: data.city,
        state: data.state,
      },
    });

    return await profile.save();
  }

  /**
   * Create customer profile
   */
  private async createUserProfile(userId: Types.ObjectId, data: any) {
    const profile = new this.customerProfileModel({
      userId,
      name: data.name || '',
      city: data.city,
      state: data.state,
    });

    return await profile.save();
  }

  /**
   * Create super admin profile
   */
  private async createSuperAdminProfile(userId: Types.ObjectId, data: any) {
    const profile = new this.superAdminProfileModel({
      userId,
      name: data.name || '',
      department: data.department || 'Administration',
      permissions: data.permissions || ['all'],
    });

    return await profile.save();
  }
}
