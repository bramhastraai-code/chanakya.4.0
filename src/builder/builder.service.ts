import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/core/entities/user.entity';
import { BuilderProfile } from 'src/profiles/builder/entities/builder-profile.entity';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { UpdateBuilderDto } from './dto/update-builder.dto';
import * as argon from 'argon2';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Status } from 'src/common/enum/status.enum';

@Injectable()
export class BuilderService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(BuilderProfile.name)
    private builderProfileModel: Model<BuilderProfile>,
  ) {}

  async create(createBuilderDto: CreateBuilderDto) {
    const existingUser = await this.userModel.findOne({
      email: createBuilderDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await argon.hash(createBuilderDto.password);

    // Create User
    const user = await this.userModel.create({
      name: createBuilderDto.name,
      email: createBuilderDto.email,
      phoneNumber: createBuilderDto.phoneNumber,
      password: hashedPassword,
      role: UserRole.BUILDER,
      isActive: true,
      isEmailVerified: true, // Auto-verify for admin created users
      isPhoneVerified: true,
    });

    // Create Profile
    const profile = await this.builderProfileModel.create({
      userId: user._id,
      companyName: createBuilderDto.companyName,
      companyLogo: createBuilderDto.companyLogo,
      establishedYear: createBuilderDto.establishedYear,
      reraNumber: createBuilderDto.reraNumber,
      gstin: createBuilderDto.gstin,
      address: createBuilderDto.address,
      contactPerson: createBuilderDto.contactPerson,
      contactEmail: createBuilderDto.contactEmail,
      contactPhone: createBuilderDto.contactPhone,
      description: createBuilderDto.description,
      socialLinks: {
        website: createBuilderDto.websiteUrl,
      },
    });

    return { user, profile };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
    filter?: any,
  ) {
    const skip = (page - 1) * limit;
    const query: any = { role: UserRole.BUILDER };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (filter) {
      // Add specific filters if needed, e.g., isActive
      if (filter.isActive !== undefined) {
        query.isActive = filter.isActive === 'true';
      }
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .sort({ [sort]: order === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.userModel.countDocuments(query).exec(),
    ]);

    // Fetch profiles for these users
    const userIds = users.map((u) => u._id);
    const profiles = await this.builderProfileModel
      .find({ userId: { $in: userIds } })
      .lean()
      .exec();

    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

    const data = users.map((user) => {
      const profile = profileMap.get(user._id.toString());
      // Remove sensitive data
      delete user.password;
      delete user.refreshToken;
      return { ...user, profile };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).lean().exec();
    if (!user || user.role !== UserRole.BUILDER) {
      throw new NotFoundException('Builder not found');
    }

    const profile = await this.builderProfileModel
      .findOne({ userId: id })
      .lean()
      .exec();

    delete user.password;
    delete user.refreshToken;

    return { ...user, profile };
  }

  async update(id: string, updateBuilderDto: UpdateBuilderDto) {
    const user = await this.userModel.findById(id);
    if (!user || user.role !== UserRole.BUILDER) {
      throw new NotFoundException('Builder not found');
    }

    // Update User fields
    if (updateBuilderDto.name) user.name = updateBuilderDto.name;
    if (updateBuilderDto.email) user.email = updateBuilderDto.email;
    if (updateBuilderDto.phoneNumber)
      user.phoneNumber = updateBuilderDto.phoneNumber;
    if (updateBuilderDto.password) {
      user.password = await argon.hash(updateBuilderDto.password);
    }

    await user.save();

    // Update Profile fields
    const profile = await this.builderProfileModel.findOne({ userId: id });
    if (profile) {
      if (updateBuilderDto.companyName)
        profile.companyName = updateBuilderDto.companyName;
      if (updateBuilderDto.companyLogo)
        profile.companyLogo = updateBuilderDto.companyLogo;
      if (updateBuilderDto.establishedYear)
        profile.establishedYear = updateBuilderDto.establishedYear;
      if (updateBuilderDto.reraNumber)
        profile.reraNumber = updateBuilderDto.reraNumber;
      if (updateBuilderDto.gstin) profile.gstin = updateBuilderDto.gstin;
      if (updateBuilderDto.address) profile.address = updateBuilderDto.address;
      if (updateBuilderDto.contactPerson)
        profile.contactPerson = updateBuilderDto.contactPerson;
      if (updateBuilderDto.contactEmail)
        profile.contactEmail = updateBuilderDto.contactEmail;
      if (updateBuilderDto.contactPhone)
        profile.contactPhone = updateBuilderDto.contactPhone;
      if (updateBuilderDto.description)
        profile.description = updateBuilderDto.description;
      if (updateBuilderDto.isVerified !== undefined)
        profile.isVerified = updateBuilderDto.isVerified;
      if (updateBuilderDto.websiteUrl) {
        profile.socialLinks = {
          ...profile.socialLinks,
          website: updateBuilderDto.websiteUrl,
        };
      }

      await profile.save();
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user || user.role !== UserRole.BUILDER) {
      throw new NotFoundException('Builder not found');
    }

    await this.userModel.findByIdAndDelete(id);
    await this.builderProfileModel.findOneAndDelete({ userId: id });

    return { message: 'Builder deleted successfully' };
  }
}
