import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BuilderProfileService } from './builder-profile.service';
import {
  UpdateBuilderProfileDto,
  UpdateBuilderSocialLinksDto,
} from './dto/update-builder-profile.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { S3Service } from 'src/s3/s3.service';

@ApiTags('Builder Profile')
@ApiBearerAuth()
@Controller('builder/profile')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.BUILDER)
export class BuilderProfileController {
  constructor(
    private readonly profileService: BuilderProfileService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get builder profile' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.profileService.getProfile(user.userId);
    return { success: true, data };
  }

  @Put()
  @ApiOperation({ summary: 'Update builder profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateBuilderProfileDto,
  ) {
    const data = await this.profileService.updateProfile(user.userId, dto);
    return { success: true, message: 'Profile updated successfully', data };
  }

  @Put('social-links')
  @ApiOperation({ summary: 'Update social media links' })
  async updateSocialLinks(
    @CurrentUser() user: any,
    @Body() dto: UpdateBuilderSocialLinksDto,
  ) {
    const data = await this.profileService.updateSocialLinks(user.userId, dto);
    return {
      success: true,
      message: 'Social links updated successfully',
      data,
    };
  }

  @Post('logo')
  @ApiOperation({ summary: 'Upload company logo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageResult = await this.s3Service.uploadFile(file, 'builder-logos');
    const data = await this.profileService.updateCompanyLogo(
      user.userId,
      imageResult.url,
    );
    return { success: true, message: 'Logo uploaded successfully', data };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get builder statistics' })
  async getStatistics(@CurrentUser() user: any) {
    const data = await this.profileService.getStatistics(user.userId);
    return { success: true, data };
  }
}
