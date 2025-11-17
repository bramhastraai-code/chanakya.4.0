import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Builder } from './entities/builder.entity';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { Project } from 'src/project/entities/project.entity';
import { Status } from 'src/common/enum/status.enum';
import { UpdateBuilderDto } from './dto/update-builder.dto';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
@Injectable()
export class BuilderService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly otpApiUrl: string;
  private readonly otpExpiry: number;
  private readonly otpLength: number;
  private readonly verifyUrl: string;
  constructor(
    @InjectModel(Builder.name) private readonly builderModel: Model<Builder>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.clientId = process.env.OTP_LESS_CLIENT_ID;
    this.clientSecret = process.env.OTP_LESS_CLIENT_SECRET;
    this.otpApiUrl = process.env.OTP_LESS_URL;
    this.verifyUrl = process.env.OTP_LESS_VERIFY_URL;
    this.otpExpiry = parseInt(process.env.OTP_LESS_EXPIERY, 10) || 300;
    this.otpLength = parseInt(process.env.OTP_LENGTH, 10) || 4;
  }

  async sendOtp_less(phoneNumber: string): Promise<any> {
    const body = JSON.stringify({
      phoneNumber,
      expiry: this.otpExpiry,
      otpLength: this.otpLength,
      channels: ['SMS'],
      metadata: { key1: 'Data1', key2: 'Data2' },
    });

    const options = {
      method: 'POST',
      headers: {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        'Content-Type': 'application/json',
      },
      body,
    };
    console.log(this.otpApiUrl, options);

    try {
      // const response = await fetch(this.otpApiUrl, options);
      // const data = await response.json();
      // console.log(data);

      // if (!response.ok) {
      //   throw new HttpException(
      //     {
      //       message: data.message,
      //       error: data.description || 'Unknown error',
      //     },
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      // return data;

      return {
        requestId: '5325',
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp_less(
    phoneNumber: string,
    requestId: string,
    otp: string,
  ): Promise<any> {
    // const options = {
    //   method: 'POST',
    //   headers: {
    //     clientId: this.clientId,
    //     clientSecret: this.clientSecret,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     requestId,
    //     otp,
    //   }),
    // };

    try {
      // Step 1: Verify OTP
      // const response = await fetch(this.verifyUrl, options);
      // const data = await response.json();
      // console.log(data);

      // if (!response.ok) {
      //   throw new HttpException(
      //     {
      //       message: data.message,
      //       error: data.description || 'please try again  later',
      //     },
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      if (requestId !== '5325' || otp !== '5325') {
        throw new HttpException(
          {
            message: 'invalid otp',
            error: 'please try again  later',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Step 2: Check if the user exists or create a new user
      let newUser = false;
      const user = await this.findByPhone(phoneNumber);

      if (!user) {
        throw new NotFoundException('No builder found with this phone number');
        newUser = true;
      }

      // Step 3: Generate Tokens
      const { accessToken, refreshToken } = await this.generateTokens(
        user._id as Types.ObjectId,
        user.phone,
      );
      await this.updateRefreshToken(user._id as Types.ObjectId, refreshToken);

      // Step 4: Return Response
      return {
        phoneNumber: user.phone,
        _id: user._id,
        newUser,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async generateTokens(userId: Types.ObjectId, phoneNumber: string) {
    const payload = { sub: userId, phoneNumber };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET') || 'abc',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_REFRESH_SECRET') || 'abc',
    });
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    console.log(userId, refreshToken);
    await this.builderModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshToken(_id: Types.ObjectId, refreshToken: string, res: Response) {
    const user = await this.builderModel.findById({ _id });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );
    // console.log(
    //   'refreshTokenlast',
    //   refreshTokenMatches,
    //   user,
    //   _id,
    //   refreshToken,
    // );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user._id as Types.ObjectId, user.phone);
    await this.updateRefreshToken(user._id as Types.ObjectId, newRefreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    console.log(newRefreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('_id', JSON.stringify(user._id), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { accessToken, refreshToken: newRefreshToken, user };
  }

  async create(createBuilderDto: CreateBuilderDto): Promise<Builder> {
    const createdBuilder = new this.builderModel(createBuilderDto);
    return await createdBuilder.save();
  }

  async findAll(
    pageSize: string = '10',
    pageNumber: string = '1',
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery?: string,
    status?: Status,
  ): Promise<{
    builders: Builder[];
    totalPages: number;
    totalBuilders: number;
    pageSize: number;
    pageNumber: number;
  }> {
    const limit = parseInt(pageSize, 10);
    const skip = (parseInt(pageNumber, 10) - 1) * limit;

    const query: any = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
      ];
    }
    if (status !== 'all') {
      query.status = status;
    }

    const [builders, totalBuilders] = await Promise.all([
      this.builderModel
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      this.builderModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalBuilders / limit);

    return {
      builders,
      totalPages,
      totalBuilders,
      pageSize: limit,
      pageNumber: parseInt(pageNumber, 10),
    };
  }

  async findOne(id: string): Promise<Builder> {
    const builder = await this.builderModel.findById(id);
    if (!builder) {
      throw new NotFoundException(`Builder with ID ${id} not found`);
    }

    // Count the total number of projects associated with this builder
    const projectCount = await this.projectModel.countDocuments({
      builder: id,
    });

    // Update the totalProject field in the builder document
    builder.totalProject = projectCount;
    await builder.save();

    return builder;
  }

  async findByPhone(phone: string): Promise<Builder | null> {
    return await this.builderModel.findOne({ phone }).exec();
  }

  async findByOwnerId(ownerId: string): Promise<Builder[]> {
    return await this.builderModel.find({ owner: ownerId }).exec();
  }

  async update(
    id: string,
    updateBuilderDto: UpdateBuilderDto,
  ): Promise<Builder> {
    const updatedBuilder = await this.builderModel.findByIdAndUpdate(
      id,
      updateBuilderDto,
      { new: true },
    );
    if (!updatedBuilder) {
      throw new NotFoundException(`Builder with ID ${id} not found`);
    }
    return updatedBuilder;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.builderModel.findByIdAndDelete(id);
    return result ? true : false;
  }

  async BuilderList() {
    const builders = await this.builderModel.find().exec();
    const data = builders.map((builder) => ({
      value: builder._id, // assuming name is the value you want
      label: builder.name, // or any other field for the label
    }));
    return data;
  }

  async getBuildersWithProjectCount() {
    try {
      const data = await this.builderModel
        .find({}, { name: 1, phone: 1, email: 1, logo: 1, totalProject: 1 })
        .sort({ totalProject: -1 }) // Sort in descending order by totalProject
        .exec();
      return data;
    } catch (error) {
      throw error;
    }
  }
}
