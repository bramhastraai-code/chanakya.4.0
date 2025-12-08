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
import { AgentBuilderAssociationService } from './services/agent-builder-association.service';

import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { CreateAssociationDto } from './dto/create-association.dto';
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
  constructor(private readonly agentService: AgentService) {}

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
  async findAll(
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
    const data = await this.agentService.findAll(
      page,
      limit,
      search,
      sort,
      order,
      isActive !== undefined
        ? { isActive, projectId, propertyId, builderId }
        : { projectId, propertyId, builderId },
    );
    return { data, message: 'Agents retrieved successfully' };
  }

  @Get('agent/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get an agent by ID (Admin)' })
  async findOne(@Param('id') id: string) {
    const data = await this.agentService.findOne(id);
    return { data, message: 'Agent retrieved successfully' };
  }

  @Put('agent/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an agent (Admin)' })
  async update(
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    const data = await this.agentService.update(id, updateAgentDto);
    return { data, message: 'Agent updated successfully' };
  }

  @Delete('agent/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an agent (Admin)' })
  async remove(@Param('id') id: string) {
    const data = await this.agentService.remove(id);
    return { data, message: 'Agent deleted successfully' };
  }
}

// --- Existing Agent Endpoints ---

@ApiTags('Agent')
@ApiBearerAuth()
@Controller('agent')
@UseGuards(jwtGuard, RolesGuard)
export class AgentProfileController {
  constructor(
    private readonly agentService: AgentService,
    private readonly s3Service: S3Service,
    private readonly associationService: AgentBuilderAssociationService,
  ) {}

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

  // ==================== Builder-Agent Association Endpoints ====================

  @Post('associations')
  @Roles(UserRole.AGENT)
  @ApiOperation({
    summary: 'Create builder-agent association for project',
    description:
      'Associate an agent with a builder and project to enable access to builder-specific content',
  })
  @ApiResponse({ status: 201, description: 'Association created successfully' })
  async createAssociation(
    @CurrentUser() user: any,
    @Body() body: CreateAssociationDto,
  ) {
    const data = await this.associationService.createAssociation(
      user.userId,
      body.builderId,
      body.projectId,
      body.invitedBy,
    );
    return {
      data,
      message: 'Association created successfully',
    };
  }

  @Get('associations')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get agent builder associations' })
  @ApiQuery({
    name: 'builderId',
    required: false,
    description: 'Filter by builder',
  })
  @ApiResponse({ status: 200, description: 'Associations retrieved' })
  async getAgentAssociations(
    @CurrentUser() user: any,
    @Query('builderId') builderId?: string,
  ) {
    const data = builderId
      ? await this.associationService.getAgentProjectsUnderBuilder(
          user.userId,
          builderId,
        )
      : await this.associationService.getAgentAssociations(user.userId);
    return {
      data,
      message: 'Associations retrieved successfully',
    };
  }

  @Delete('associations/:id')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Remove builder-agent association' })
  @ApiParam({ name: 'id', description: 'Association ID' })
  @ApiResponse({ status: 200, description: 'Association removed' })
  async removeAssociation(
    @CurrentUser() user: any,
    @Param('id') associationId: string,
  ) {
    const data =
      await this.associationService.removeAssociationById(associationId);
    return {
      data,
      message: 'Association removed successfully',
    };
  }

  @Get('associations/check')
  @Roles(UserRole.AGENT)
  @ApiOperation({
    summary: 'Check if agent is associated with builder/project',
  })
  @ApiQuery({ name: 'builderId', required: true })
  @ApiQuery({ name: 'projectId', required: true })
  @ApiResponse({ status: 200, description: 'Association status' })
  async checkAssociation(
    @CurrentUser() user: any,
    @Query('builderId') builderId: string,
    @Query('projectId') projectId: string,
  ) {
    const data = await this.associationService.isAgentAssociated(
      user.userId,
      builderId,
      projectId,
    );
    return {
      data: { isAssociated: data },
      message: data
        ? 'Agent is associated with this project'
        : 'Agent is not associated',
    };
  }
}
