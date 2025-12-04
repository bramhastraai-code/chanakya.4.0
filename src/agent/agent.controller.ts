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
  async create(@Body() createAgentDto: CreateAgentDto) {
    const data = await this.agentService.create(createAgentDto);
    return { data, message: 'Agent created successfully' };
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
  @ApiQuery({
    name: 'projectId',
    required: false,
    type: String,
    description:
      'Filter agents who created properties/projects in this project',
  })
  @ApiQuery({
    name: 'propertyId',
    required: false,
    type: String,
    description: 'Filter agent who created this property',
  })
  @ApiQuery({
    name: 'builderId',
    required: false,
    type: String,
    description: 'Filter agents by builder association',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('isActive') isActive?: boolean,
    @Query('projectId') projectId?: string,
    @Query('propertyId') propertyId?: string,
    @Query('builderId') builderId?: string,
  ) {
    return this.agentService.findAll(
      page,
      limit,
      search,
      sort,
      order,
      isActive !== undefined
        ? { isActive, projectId, propertyId, builderId }
        : { projectId, propertyId, builderId },
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
    return { data, message: 'Dashboard statistics retrieved successfully' };
  }

  @Get('dashboard/listings-summary')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get listings summary' })
  async getListingsSummary(@CurrentUser() user: any) {
    const data = await this.agentService.getListingsSummary(user.userId);
    return { data, message: 'Listings summary retrieved successfully' };
  }

  @Get('profile')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get agent profile' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.agentService.getProfile(user.userId);
    return { data, message: 'Profile retrieved successfully' };
  }

  @Put('profile')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Update agent profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateProfileDto,
  ) {
    const data = await this.agentService.updateProfile(user.userId, updateDto);
    return { data, message: 'Profile updated successfully' };
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
    return { data, message: 'Social links updated successfully' };
  }

  @Put('profile/website')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Update website URL' })
  async updateWebsite(
    @CurrentUser() user: any,
    @Body() websiteDto: UpdateWebsiteDto,
  ) {
    const data = await this.agentService.updateWebsite(user.userId, websiteDto);
    return { data, message: 'Website updated successfully' };
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
      data: businessInfo,
      message: 'Business information retrieved successfully',
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
    return { data, message: 'Business information updated successfully' };
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
    return { data, message: 'Profile image uploaded successfully' };
  }

  @Get('profile/statistics')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get agent profile statistics' })
  async getStatistics(@CurrentUser() user: any) {
    const data = await this.agentService.getStatistics(user.userId);
    return { data, message: 'Statistics retrieved successfully' };
  }

  @Get('subscriptions/plans')
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get subscription plans' })
  async getPlans() {
    const data = await this.agentService.getPlans();
    return { data, message: 'Subscription plans retrieved successfully' };
  }

  @Get('subscriptions/current')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get current subscription' })
  async getCurrent(@CurrentUser() user: any) {
    const data = await this.agentService.getCurrentSubscription(user.userId);
    return { data, message: 'Current subscription retrieved successfully' };
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
      data,
      message: 'Subscription purchased successfully',
    };
  }
}
