import { Body, Controller, Patch, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response as CustomResponse } from 'src/common/interceptor/response.interface';
import { Types } from 'mongoose';
// import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
import { User } from 'src/user/entity/user.entity';
import { AdminResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('register')
  // @ApiOperation({ summary: 'User registration' })
  // @ApiBody({ type: CreateUserDto })
  // @ApiResponse({ status: 201, description: 'User registered successfully' })
  // async signup(
  //   @Body() dto: CreateUserDto,
  //   @Res({ passthrough: true }) res: Response,
  // ): Promise<
  //   CustomResponse<{
  //     email: string;
  //     _id: Types.ObjectId;
  //   }>
  // > {
  //   const data = await this.authService.register(dto, res);
  //   return { data, message: 'User registered successfully' };
  // }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: UpdateAuthDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async signin(
    @Body() dto: UpdateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<
    CustomResponse<{
      email: string;
      _id: Types.ObjectId;
    }>
  > {
    const data = await this.authService.login(dto, res);
    return { data, message: 'User logged in successfully' };
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
    const data = await this.authService.refreshToken(
      userId,
      dto.refreshToken,
      res,
    );
    return { data, message: 'Token refreshed successfully' };
  }

  @Patch('reset-password')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: AdminResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async resetPassword(
    @Body() dto: AdminResetPasswordDto,
  ): Promise<CustomResponse<User>> {
    console.log('dto', dto);

    // Ensure userId is cast to Types.ObjectId
    const data = await this.authService.resetPassword(
      dto.userId,
      dto.newPassword,
    );
    return { data, message: 'password reset successfully successfully' };
  }
}
