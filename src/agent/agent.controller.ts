import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AgentService } from './agent.service';
import {
  UpdateProfileDto,
  UpdateSocialLinksDto,
  UpdateWebsiteDto,
  UpdateBusinessInfoDto,
} from './dto/update-profile.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { S3Service } from 'src/s3/s3.service';

@ApiTags('Agent')
@ApiBearerAuth()
@Controller('api/agent')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly s3Service: S3Service,
  ) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get agent dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats(@CurrentUser() user: any) {
    const data = await this.agentService.getDashboardStats(user.userId);
    return { success: true, data };
  }

  @Get('dashboard/listings-summary')
  @ApiOperation({ summary: 'Get listings summary' })
  @ApiResponse({ status: 200, description: 'Listings summary retrieved' })
  async getListingsSummary(@CurrentUser() user: any) {
    const data = await this.agentService.getListingsSummary(user.userId);
    return { success: true, data };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get agent profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.agentService.getProfile(user.userId);
    return { success: true, data };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update agent profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateProfileDto,
  ) {
    const data = await this.agentService.updateProfile(user.userId, updateDto);
    return { success: true, message: 'Profile updated successfully', data };
  }

  @Put('profile/social-links')
  @ApiOperation({ summary: 'Update social media links' })
  @ApiResponse({
    status: 200,
    description: 'Social links updated successfully',
  })
  async updateSocialLinks(
    @CurrentUser() user: any,
    @Body() socialLinksDto: UpdateSocialLinksDto,
  ) {
    const data = await this.agentService.updateSocialLinks(
      user.userId,
      socialLinksDto,
    );
    return {
      success: true,
      message: 'Social links updated successfully',
      data,
    };
  }

  @Put('profile/website')
  @ApiOperation({ summary: 'Update website URL' })
  @ApiResponse({ status: 200, description: 'Website updated successfully' })
  async updateWebsite(
    @CurrentUser() user: any,
    @Body() websiteDto: UpdateWebsiteDto,
  ) {
    const data = await this.agentService.updateWebsite(user.userId, websiteDto);
    return { success: true, message: 'Website updated successfully', data };
  }

  @Put('profile/business-info')
  @ApiOperation({ summary: 'Update business information' })
  @ApiResponse({
    status: 200,
    description: 'Business info updated successfully',
  })
  async updateBusinessInfo(
    @CurrentUser() user: any,
    @Body() businessDto: UpdateBusinessInfoDto,
  ) {
    const data = await this.agentService.updateBusinessInfo(
      user.userId,
      businessDto,
    );
    return {
      success: true,
      message: 'Business information updated successfully',
      data,
    };
  }

  @Post('profile/image')
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
    // Upload to S3
    // Specify folder for S3 upload
    const imageResult = await this.s3Service.uploadFile(
      file,
      'agent-profile-images',
    );
    const data = await this.agentService.updateProfileImage(
      user.userId,
      imageResult.url,
    );
    return {
      success: true,
      message: 'Profile image uploaded successfully',
      data,
    };
  }

  @Get('subscriptions/plans')
  @ApiOperation({ summary: 'Get subscription plans' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  async getPlans() {
    const data = await this.agentService.getPlans();
    return { success: true, data };
  }

  @Get('subscriptions/current')
  @ApiOperation({ summary: 'Get current subscription' })
  @ApiResponse({ status: 200, description: 'Current subscription retrieved' })
  async getCurrent(@CurrentUser() user: any) {
    const data = await this.agentService.getCurrentSubscription(user.userId);
    return { success: true, data };
  }

  @Post('subscriptions/purchase/:planId')
  @ApiOperation({ summary: 'Purchase subscription' })
  @ApiParam({ name: 'planId', type: String })
  @ApiResponse({
    status: 201,
    description: 'Subscription purchased successfully',
  })
  async purchase(@CurrentUser() user: any, @Param('planId') planId: string) {
    const data = await this.agentService.purchaseSubscription(
      user.userId,
      planId,
    );
    return {
      success: true,
      message: 'Subscription purchased successfully',
      data,
    };
  }
}
