import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AgentService } from './agent.service';

import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { S3Service } from 'src/s3/s3.service';
import {
  UpdateBusinessInfoDto,
  UpdateProfileDto,
  UpdateSocialLinksDto,
  UpdateWebsiteDto,
} from './dto/update-profile.dto';

@ApiTags('Agent BY Admin')
@ApiBearerAuth()
@Controller('agent-by-admin')
@UseGuards(jwtGuard, RolesGuard)
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly s3Service: S3Service,
  ) {}

  // --- Admin Endpoints ---

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new agent (Admin)' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentService.create(createAgentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all agents with pagination and filters (Admin)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('isActive') isActive?: boolean,
  ) {
    return this.agentService.findAll(
      page,
      limit,
      search,
      sort,
      order,
      isActive !== undefined ? { isActive } : undefined,
    );
  }

  @Get('agent/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get an agent by ID (Admin)' })
  findOne(@Param('id') id: string) {
    return this.agentService.findOne(id);
  }

  @Put('agent/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an agent (Admin)' })
  update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentService.update(id, updateAgentDto);
  }

  @Delete('agent/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an agent (Admin)' })
  remove(@Param('id') id: string) {
    return this.agentService.remove(id);
  }

  // --- Existing Agent Endpoints ---

  @Get('dashboard/stats')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get agent dashboard statistics' })
  async getStats(@CurrentUser() user: any) {
    const data = await this.agentService.getDashboardStats(user.userId);
    return { success: true, data };
  }

  @Get('dashboard/listings-summary')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get listings summary' })
  async getListingsSummary(@CurrentUser() user: any) {
    const data = await this.agentService.getListingsSummary(user.userId);
    return { success: true, data };
  }

  @Get('profile')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get agent profile' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.agentService.getProfile(user.userId);
    return { success: true, data };
  }

  @Put('profile')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Update agent profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateProfileDto,
  ) {
    const data = await this.agentService.updateProfile(user.userId, updateDto);
    return { success: true, message: 'Profile updated successfully', data };
  }

  @Put('profile/social-links')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Update social media links' })
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
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Update website URL' })
  async updateWebsite(
    @CurrentUser() user: any,
    @Body() websiteDto: UpdateWebsiteDto,
  ) {
    const data = await this.agentService.updateWebsite(user.userId, websiteDto);
    return { success: true, message: 'Website updated successfully', data };
  }

  @Get('profile/business-info')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get business information' })
  async getBusinessInfo(@CurrentUser() user: any) {
    const data: any = await this.agentService.getProfile(user.userId);
    const businessInfo = {
      company: data.company || '',
      experienceYears: data.experienceYears || 0,
      specialization: data.specialization || [],
      serviceAreas: data.serviceAreas || [],
      city: data.city || '',
      state: data.state || '',
    };
    return {
      success: true,
      message: 'Business information retrieved successfully',
      data: businessInfo,
    };
  }

  @Put('profile/business-info')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Update business information' })
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
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
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
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get subscription plans' })
  async getPlans() {
    const data = await this.agentService.getPlans();
    return { success: true, data };
  }

  @Get('subscriptions/current')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get current subscription' })
  async getCurrent(@CurrentUser() user: any) {
    const data = await this.agentService.getCurrentSubscription(user.userId);
    return { success: true, data };
  }

  @Post('subscriptions/purchase/:planId')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Purchase subscription' })
  @ApiParam({ name: 'planId', type: String })
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
