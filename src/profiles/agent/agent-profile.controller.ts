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
import { AgentProfileService } from './agent-profile.service';
import {
  UpdateAgentProfileDto,
  UpdateSocialLinksDto,
  UpdateWebsiteDto,
} from './dto/update-agent-profile.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { S3Service } from 'src/s3/s3.service';

@ApiTags('Agent Profile')
@ApiBearerAuth()
@Controller('agent/profile')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class AgentProfileController {
  constructor(
    private readonly profileService: AgentProfileService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get agent profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.profileService.getProfile(user.userId);
    return {
      success: true,
      data,
    };
  }

  @Put()
  @ApiOperation({ summary: 'Update agent profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateAgentProfileDto,
  ) {
    const data = await this.profileService.updateProfile(user.userId, dto);
    return {
      success: true,
      message: 'Profile updated successfully',
      data,
    };
  }

  @Put('social-links')
  @ApiOperation({ summary: 'Update social media links' })
  @ApiResponse({
    status: 200,
    description: 'Social links updated successfully',
  })
  async updateSocialLinks(
    @CurrentUser() user: any,
    @Body() dto: UpdateSocialLinksDto,
  ) {
    const data = await this.profileService.updateSocialLinks(user.userId, dto);
    return {
      success: true,
      message: 'Social links updated successfully',
      data,
    };
  }

  @Put('website')
  @ApiOperation({ summary: 'Update website URL' })
  @ApiResponse({ status: 200, description: 'Website updated successfully' })
  async updateWebsite(@CurrentUser() user: any, @Body() dto: UpdateWebsiteDto) {
    const data = await this.profileService.updateWebsite(user.userId, dto);
    return {
      success: true,
      message: 'Website updated successfully',
      data,
    };
  }

  @Post('image')
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Profile image uploaded successfully',
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageResult = await this.s3Service.uploadFile(file, 'agent-profiles');
    const data = await this.profileService.updateProfileImage(
      user.userId,
      imageResult.url,
    );
    return {
      success: true,
      message: 'Profile image uploaded successfully',
      data,
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get agent statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics(@CurrentUser() user: any) {
    const data = await this.profileService.getStatistics(user.userId);
    return {
      success: true,
      data,
    };
  }
}
