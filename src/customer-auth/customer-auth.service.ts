import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { Customer } from 'src/customer/entities/customer.entity';
import { CreateCustomerAuthDto } from './dto/create-customer-auth.dto';
import { Otp } from './entity/otp.entity';
import { randomInt } from 'crypto';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class CustomerAuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly otpApiUrl: string;
  private readonly otpExpiry: number;
  private readonly otpLength: number;
  private readonly verifyUrl: string;
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private jwt: JwtService,
    private config: ConfigService,
    private customerService: CustomerService,
  ) {
    this.clientId = process.env.OTP_LESS_CLIENT_ID;
    this.clientSecret = process.env.OTP_LESS_CLIENT_SECRET;
    this.otpApiUrl = process.env.OTP_LESS_URL;
    this.verifyUrl = process.env.OTP_LESS_VERIFY_URL;
    this.otpExpiry = parseInt(process.env.OTP_LESS_EXPIERY, 10) || 300;
    this.otpLength = parseInt(process.env.OTP_LENGTH, 10) || 4;
  }

  // async login(dto: UpdateCustomerAuthDto, res: Response) {
  //   const user = await this.customerModel.findOne({ phoneNumber: dto.phoneNumber });
  //   if (!user) {
  //     throw new ForbiddenException('Unauthorized User');
  //   }
  //   const pwMatches = await argon.verify(user.password, dto.password);
  //   if (!pwMatches) {
  //     throw new ForbiddenException('Credential incorrect');
  //   }

  //   const { accessToken, refreshToken } = await this.generateTokens(
  //     user._id,
  //     user.phoneNumber,
  //   );
  //   await this.updateRefreshToken(user._id, refreshToken);

  //   res.cookie('accessToken', accessToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'strict',
  //   });
  //   res.cookie('refreshToken', refreshToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'strict',
  //   });
  //   res.cookie('_id', JSON.stringify(user._id), {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'strict',
  //   });

  //   return {
  //     phoneNumber: user.phoneNumber,
  //     _id: user._id,
  //     accessToken,
  //     refreshToken,
  //   };
  // }

  async sendOtp(phoneNumber: string): Promise<string> {
    const otp = randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + 5); // OTP valid for 5 minutes

    // Save OTP and mobile to the database
    await this.otpModel.create({ phoneNumber, otp, expiresIn });

    // Send OTP via SMS
    await this.sendSms(phoneNumber, `Your OTP is ${otp}`);
    return otp;
  }

  async sendOtp_less(phoneNumber: string): Promise<any> {
    // const body = JSON.stringify({
    //   phoneNumber,
    //   expiry: this.otpExpiry,
    //   otpLength: this.otpLength,
    //   channels: ['SMS'],
    //   metadata: { key1: 'Data1', key2: 'Data2' },
    // });

    // const options = {
    //   method: 'POST',
    //   headers: {
    //     clientId: this.clientId,
    //     clientSecret: this.clientSecret,
    //     'Content-Type': 'application/json',
    //   },
    //   body,
    // };
    console.log(phoneNumber);

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

      return {
        requestId: '5325',
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(
    phoneNumber: string,
    otp: string,
  ): Promise<{
    phoneNumber: string;
    _id: string;
    newUser: boolean;
    accessToken: string;
    refreshToken: string;
  }> {
    console.log(phoneNumber, otp);

    const otpRecord = await this.otpModel
      .findOne({ phoneNumber })
      .sort({ createdAt: -1 })
      .exec();
    console.log('otpRecord', otpRecord), otpRecord;

    if (!otpRecord) {
      throw new BadRequestException('OTP not found');
    }

    const isOtpValid =
      otpRecord.otp === otp && otpRecord.expiresIn > new Date();

    if (!isOtpValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark OTP as used or delete it if needed
    await this.otpModel.deleteOne({ _id: otpRecord._id }).exec();

    // Optionally, register or log the user in after OTP verification
    let newUser: boolean = false;
    let user = await this.customerService.findByMobile(phoneNumber);
    if (!user) {
      user = await this.customerService.create({ phoneNumber });
      newUser = true;
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id,
      user.phoneNumber,
    );
    await this.updateRefreshToken(user._id, refreshToken);

    // Authentication is successful at this point
    return {
      phoneNumber: user.phoneNumber,
      _id: user._id,
      newUser,
      accessToken,
      refreshToken,
    };
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
      let user = await this.customerService.findByMobile(phoneNumber);

      if (!user) {
        user = await this.customerService.create({ phoneNumber });
        newUser = true;
      }

      // Step 3: Generate Tokens
      const { accessToken, refreshToken } = await this.generateTokens(
        user._id,
        user.phoneNumber,
      );
      await this.updateRefreshToken(user._id, refreshToken);

      // Step 4: Return Response
      return {
        phoneNumber: user.phoneNumber,
        _id: user._id,
        newUser,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async sendSms(mobile: string, message: string): Promise<void> {
    // Logic to integrate with SMS provider (e.g., Twilio, Nexmo)
    console.log(mobile, message);
  }

  async register(dto: CreateCustomerAuthDto, res: Response) {
    const oldUser = await this.customerModel.findOne({
      phoneNumber: dto.phoneNumber,
    });
    if (oldUser) {
      throw new ForbiddenException('phoneNumber is already in use');
    }
    const user = await new this.customerModel(dto).save();

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id,
      user.phoneNumber,
    );
    await this.updateRefreshToken(user.id, refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('_id', JSON.stringify(user._id), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      email: user.phoneNumber,
      _id: user._id,
      user,
    };
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
    await this.customerModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshToken(_id: Types.ObjectId, refreshToken: string, res: Response) {
    const user = await this.customerModel.findById({ _id });
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
      await this.generateTokens(user._id, user.phoneNumber);
    await this.updateRefreshToken(user._id, newRefreshToken);

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
}
