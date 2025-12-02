import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { randomInt } from 'crypto';

import { User } from '../entities/user.entity';
import { Otp } from '../entities/otp.entity';
import { ProfileFactory } from '../services/profile-factory.service';
import {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  LoginWithOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { UserRole } from 'src/common/enum/user-role.enum';
import { BrevoEmailService } from 'src/common/services/brevo-email.service';

@Injectable()
export class UnifiedAuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private jwt: JwtService,
    private config: ConfigService,
    private profileFactory: ProfileFactory,
    private brevoEmailService: BrevoEmailService,
  ) {}

  /**
   * Register new user with role-based profile creation
   */
  async register(dto: RegisterDto) {
    // Check if email already exists
    const existingEmail = await this.userModel.findOne({ email: dto.email });
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if phone already exists
    const existingPhone = await this.userModel.findOne({
      phoneNumber: dto.phoneNumber,
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already registered');
    }

    // Hash password
    const hashedPassword = await argon.hash(dto.password);

    // Create user
    const user = await this.userModel.create({
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: hashedPassword,
      role: dto.role,
      fcmToken: dto.fcmToken,
      isEmailVerified: false,
      isPhoneVerified: false,
    });

    // Create role-specific profile
    const profile = await this.profileFactory.createProfile(
      user._id as Types.ObjectId,
      dto.role,
      {
        name: dto.name,
        company: dto.company,
        companyName: dto.company,
        city: dto.city,
        state: dto.state,
      },
    );

    // Send verification email/OTP
    await this.sendVerificationEmail(dto.email);

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user._id as Types.ObjectId,
      user.email,
      user.role,
    );

    // Update refresh token
    await this.updateRefreshToken(user._id as Types.ObjectId, refreshToken);

    return {
      user: {
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      profile,
      accessToken,
      refreshToken,
      expiresIn: 86400, // 24 hours
    };
  }

  /**
   * Login with email and password
   */
  async login(dto: LoginDto) {
    // Find user
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await argon.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Get profile (create if doesn't exist for backward compatibility)
    let profile = await this.profileFactory.getProfile(
      user._id as Types.ObjectId,
      user.role,
    );

    // If profile doesn't exist, create it (for users created before profile system)
    if (!profile) {
      profile = await this.profileFactory.createProfile(
        user._id as Types.ObjectId,
        user.role,
        {
          name: user.name || user.email.split('@')[0],
          city: user.city,
          state: user.state,
        },
      );
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user._id as Types.ObjectId,
      user.email,
      user.role,
    );

    // Update refresh token and last login
    await this.updateRefreshToken(user._id as Types.ObjectId, refreshToken);
    await this.userModel.findByIdAndUpdate(user._id, {
      lastLoginAt: new Date(),
      fcmToken: dto.fcmToken,
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isKycVerified: (profile as any)?.isKycVerified || false,
      },
      profile,
      accessToken,
      refreshToken,
      expiresIn: 86400,
    };
  }

  /**
   * Send OTP to email
   */
  async sendOtp(dto: SendOtpDto) {
    const email = dto.email.toLowerCase().trim();

    // Generate 6-digit OTP
    const otp = randomInt(100000, 999999).toString();
    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + 5); // Valid for 5 minutes

    // Delete any existing OTPs for this email
    await this.otpModel.deleteMany({ email });

    // Save new OTP
    const createdOtp = await this.otpModel.create({ email, otp, expiresIn });
    console.log(
      `[Debug] OTP generated for ${email}: ${otp}, Expires: ${expiresIn}, ID: ${createdOtp._id}`,
    );

    // Send OTP via email
    try {
      await this.brevoEmailService.sendOtpEmail({
        to: email,
        otp,
        subject: 'Your OTP for Chanakya AI',
      });
    } catch (err) {
      console.error('Error sending OTP email:', err);
      throw new BadRequestException('Failed to send OTP email');
    }

    return {
      message: 'OTP sent successfully to your email',
      email,
    };
  }

  /**
   * Verify OTP (without login)
   */
  async verifyOtp(dto: VerifyOtpDto) {
    const email = dto.email.toLowerCase().trim();
    const { otp } = dto;

    // Find latest OTP for this email
    const otpRecord = await this.otpModel
      .findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    console.log(
      `[Debug] VerifyOtp for ${email}: Input=${otp}, Found=${otpRecord?.otp}, Expires=${otpRecord?.expiresIn}`,
    );

    if (!otpRecord) {
      throw new BadRequestException('OTP not found. Please request a new OTP.');
    }

    // Check if OTP is valid and not expired
    const isValid = otpRecord.otp === otp && otpRecord.expiresIn > new Date();

    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Delete OTP after verification
    await this.otpModel.deleteOne({ _id: otpRecord._id });

    // Mark email as verified if user exists
    const data = await this.userModel.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
    );

    return {
      message: 'OTP verified successfully',
      email,
      verified: true,
      data,
    };
  }

  /**
   * Login with OTP (passwordless)
   */
  async loginWithOtp(dto: LoginWithOtpDto) {
    const email = dto.email.toLowerCase().trim();
    const { otp } = dto;

    // Verify OTP first
    const otpRecord = await this.otpModel
      .findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    console.log(
      `[Debug] LoginWithOtp for ${email}: Input=${otp}, Found=${otpRecord?.otp}, Expires=${otpRecord?.expiresIn}`,
    );

    if (!otpRecord) {
      throw new BadRequestException('OTP not found. Please request a new OTP.');
    }

    const isValid = otpRecord.otp === otp && otpRecord.expiresIn > new Date();

    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Find or create user
    let user = await this.userModel.findOne({ email });
    let newUser = false;
    let profile: any = null;

    if (!user) {
      // Create new user with default role (CUSTOMER or specified role)
      const defaultRole = dto.role || UserRole.CUSTOMER;

      user = await this.userModel.create({
        email,
        phoneNumber: email, // Use email as placeholder
        password: await argon.hash(randomInt(100000, 999999).toString()), // Random password
        role: defaultRole,
        isEmailVerified: true,
      });

      // Create profile
      profile = await this.profileFactory.createProfile(
        user._id as Types.ObjectId,
        defaultRole,
        { name: email.split('@')[0] }, // Default name from email
      );

      newUser = true;
    } else {
      // Get existing profile
      profile = await this.profileFactory.getProfile(
        user._id as Types.ObjectId,
        user.role,
      );

      // Mark email as verified
      user.isEmailVerified = true;
      await user.save();
    }

    // Delete OTP
    await this.otpModel.deleteOne({ _id: otpRecord._id });

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user._id as Types.ObjectId,
      email,
      user.role,
    );

    // Update refresh token and last login
    await this.updateRefreshToken(user._id as Types.ObjectId, refreshToken);
    await this.userModel.findByIdAndUpdate(user._id, {
      lastLoginAt: new Date(),
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isKycVerified: (profile as any)?.isKycVerified || false,
      },
      profile,
      accessToken,
      refreshToken,
      expiresIn: 86400,
    };
  }

  /**
   * Forgot password - send OTP
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;

    // Check if user exists (but don't reveal this to the user for security)
    const user = await this.userModel.findOne({ email });

    if (user) {
      // Send OTP
      await this.sendOtp({ email });
    }

    // Always return success to prevent email enumeration
    return {
      message: 'If the email exists, an OTP has been sent for password reset',
      email,
    };
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(dto: ResetPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const { otp, newPassword } = dto;

    // Verify OTP
    const otpRecord = await this.otpModel
      .findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    console.log(
      `[Debug] ResetPassword for ${email}: Input=${otp}, Found=${otpRecord?.otp}, Expires=${otpRecord?.expiresIn}`,
    );

    if (!otpRecord) {
      throw new BadRequestException('OTP not found. Please request a new OTP.');
    }

    const isValid = otpRecord.otp === otp && otpRecord.expiresIn > new Date();

    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Find user
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hash new password
    const hashedPassword = await argon.hash(newPassword);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP
    await this.otpModel.deleteOne({ _id: otpRecord._id });

    return {
      message: 'Password reset successful',
      email,
      data: user,
    };
  }

  /**
   * Change password (for logged-in users)
   */
  async changePassword(userId: Types.ObjectId, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await argon.verify(
      user.password,
      dto.currentPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await argon.hash(dto.newPassword);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return {
      message: 'Password changed successfully',
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET') || 'abc',
      });

      const user = await this.userModel.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify refresh token matches
      const refreshTokenMatches = await argon.verify(
        user.refreshToken,
        refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(
        user._id as Types.ObjectId,
        user.email,
        user.role,
      );

      // Update refresh token
      await this.updateRefreshToken(
        user._id as Types.ObjectId,
        tokens.refreshToken,
      );

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 86400,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout
   */
  async logout(userId: Types.ObjectId) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
      fcmToken: null,
    });

    return {
      message: 'Logged out successfully',
    };
  }

  /**
   * Generate JWT tokens with role payload
   */
  async generateTokens(userId: Types.ObjectId, email: string, role: UserRole) {
    const payload = {
      sub: userId.toString(),
      email,
      role,
    };

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

  /**
   * Update refresh token in database
   */
  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  /**
   * Send verification email
   */
  private async sendVerificationEmail(email: string) {
    const otp = randomInt(100000, 999999).toString();
    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + 30); // 30 min for verification

    await this.otpModel.create({ email, otp, expiresIn });

    try {
      await this.brevoEmailService.sendOtpEmail({
        to: email,
        otp,
        subject: 'Welcome to Chanakya AI - Verify Your Email',
      });
    } catch (err) {
      console.error('Error sending verification email:', err);
    }
  }

  /**
   * Get current user info with profile
   */
  async getMe(userId: Types.ObjectId, role: UserRole) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile = await this.profileFactory.getProfile(userId, role);

    // If profile doesn't exist, create it (for users created before profile system)
    if (!profile) {
      profile = await this.profileFactory.createProfile(userId, role, {
        name: user.name || user.email.split('@')[0],
        city: user.city,
        state: user.state,
      });
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isKycVerified: (profile as any)?.isKycVerified || false,
        profileImage: (profile as any)?.profileImage || user.profileImage,
        name:
          (profile as any)?.name || (profile as any)?.companyName || user.name,
      },
      profile,
    };
  }
}
