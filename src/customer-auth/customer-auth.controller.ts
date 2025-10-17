import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response as CustomResponse } from 'src/common/interceptor/response.interface';
import { Types } from 'mongoose';
import { Response } from 'express';

import { CustomerAuthService } from './customer-auth.service';
import { UpdateCustomerAuthDto } from './dto/update-customer-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  CreateCustomerAuthDto,
  VerifyOtpDto,
} from './dto/create-customer-auth.dto';
import { error } from 'console';

@ApiTags('Customer Authentication')
@Controller('customer-auth')
export class CustomerAuthController {
  constructor(private authCustomerService: CustomerAuthService) {}

  // @Post('login')
  // @ApiOperation({ summary: 'Customer login' })
  // @ApiBody({ type: UpdateCustomerAuthDto })
  // @ApiResponse({ status: 200, description: 'Customer logged in successfully' })
  // async signin(
  //   @Body() dto: UpdateCustomerAuthDto,
  //   @Res({ passthrough: true }) res: Response,
  // ): Promise<
  //   CustomResponse<{
  //     email: string;
  //     _id: Types.ObjectId;
  //   }>
  // > {
  //   const data = await this.authCustomerService.login(dto, res);
  //   return { data, message: 'Customer logged in successfully' };
  // }

  @Post('send-otp')
  @ApiOperation({ summary: 'Customer login' })
  @ApiBody({ type: UpdateCustomerAuthDto })
  @ApiResponse({ status: 200, description: 'Customer logged in successfully' })
  async sendOtp(
    @Body('phoneNumber') phoneNumber: string,
  ): Promise<CustomResponse<any>> {
    const data = await this.authCustomerService.sendOtp(phoneNumber);
    return { data, message: `OTP sent successfully ${data}` };
  }

  @Post('send-otp-less')
  @ApiOperation({ summary: 'Send OTP to a phone number' })
  @ApiBody({ type: UpdateCustomerAuthDto })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid phone number' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async sendOtp_less(@Body('phoneNumber') phoneNumber: string) {
    try {
      if (!phoneNumber) {
        throw new BadRequestException('Phone number is required');
      }

      const data = await this.authCustomerService.sendOtp_less(phoneNumber);
      return { data, message: 'OTP sent successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'otp Verification ' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'Customer Verified successfully  ' })
  async verifyOtp(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
  ): Promise<CustomResponse<any>> {
    const isVerified = await this.authCustomerService.verifyOtp(
      phoneNumber,
      otp,
    );
    if (isVerified) {
      console.log(isVerified);
      return { message: 'OTP verified successfully', data: isVerified };
    } else {
      throw error('OTP verification failed');
    }
  }

  @Post('/verify-otp-less')
  @ApiOperation({ summary: 'Verify OTP and authenticate user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: { type: 'string', example: '+15551234567' },
        requestId: {
          type: 'string',
          example: '6492d9f9be434d3281527225032f611b',
        },
        otp: { type: 'string', example: '8482' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'OTP verification successful.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or phone number mismatch.',
  })
  async verifyOtp_less(
    @Body('phoneNumber') phoneNumber: string,
    @Body('requestId') requestId: string,
    @Body('otp') otp: string,
  ) {
    try {
      const data = await this.authCustomerService.verifyOtp_less(
        phoneNumber,
        requestId,
        otp,
      );
      return { data, message: 'OTP verified successfully ' };
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Customer login' })
  @ApiBody({ type: CreateCustomerAuthDto })
  @ApiResponse({ status: 200, description: 'Customer logged in successfully' })
  async register(
    @Body() dto: CreateCustomerAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<
    CustomResponse<{
      email: string;
      _id: Types.ObjectId;
    }>
  > {
    const data = await this.authCustomerService.register(dto, res);
    return { data, message: 'Customer logged in successfully' };
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async refreshToken(
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<
    CustomResponse<{
      accessToken: string;
      refreshToken: string;
    }>
  > {
    const userId = dto.userId; // Ensure userId is cast to Types.ObjectId
    const data = await this.authCustomerService.refreshToken(
      userId,
      dto.refreshToken,
      res,
    );
    return { data, message: 'Token refreshed successfully' };
  }
}
