import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BuilderService } from './builder.service';
import { AgentBuilderAssociationService } from '../agent/services/agent-builder-association.service';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { UpdateBuilderDto } from './dto/update-builder.dto';
import { AddAgentDto, BulkAddAgentsDto } from './dto/add-agent.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { S3Service } from 'src/s3/s3.service';

@ApiTags('Builder')
@ApiBearerAuth()
@Controller('builder')
@UseGuards(jwtGuard, RolesGuard)
export class BuilderController {
  constructor(
    private readonly builderService: BuilderService,
    private readonly s3Service: S3Service,
    private readonly associationService: AgentBuilderAssociationService,
  ) {}

  @Get('profile')
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Get builder profile',
    description:
      'Retrieve complete profile information of the authenticated builder including company details',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.builderService.getProfile(user.userId);
    return { data, message: 'Profile retrieved successfully' };
  }

  @Put('profile')
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Update builder profile',
    description:
      'Update builder company information including name, description, location, and contact details',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@CurrentUser() user: any, @Body() dto: any) {
    const data = await this.builderService.updateProfile(user.userId, dto);
    return { data, message: 'Profile updated successfully' };
  }

  @Put('profile/social-links')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ summary: 'Update social media links' })
  async updateSocialLinks(@CurrentUser() user: any, @Body() dto: any) {
    const data = await this.builderService.updateSocialLinks(user.userId, dto);
    return { data, message: 'Social links updated successfully' };
  }

  @Post('profile/logo')
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Upload company logo',
    description:
      'Upload or update the builder company logo image. Accepts image files (JPG, PNG)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Logo uploaded successfully' })
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageResult = await this.s3Service.uploadFile(file, 'builder-logos');
    const data = await this.builderService.updateCompanyLogo(
      user.userId,
      imageResult.url,
    );
    return { data, message: 'Logo uploaded successfully' };
  }

  @Get('statistics')
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Get builder statistics',
    description:
      'Retrieve comprehensive statistics including projects, properties, agents, leads, and sales data',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics(@CurrentUser() user: any) {
    const data = await this.builderService.getStatistics(user.userId);
    return { data, message: 'Statistics retrieved successfully' };
  }

  // ==================== Agent Management Endpoints ====================

  @Post('agents')
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Add agent to builder project',
    description:
      'Associate an agent with a specific project to give them access to project details, leads, and offers',
  })
  @ApiResponse({
    status: 201,
    description: 'Agent added successfully to project',
  })
  @ApiResponse({ status: 404, description: 'Agent or project not found' })
  async addAgent(@CurrentUser() user: any, @Body() body: AddAgentDto) {
    const data = await this.associationService.createAssociation(
      body.agentId,
      user.userId,
      body.projectId,
      user.userId,
    );
    return {
      data,
      message: 'Agent added to project successfully',
    };
  }

  @Post('agents/bulk')
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Add multiple agents to project',
    description:
      'Bulk associate multiple agents with a project in one operation',
  })
  @ApiResponse({
    status: 201,
    description: 'All agents added successfully to project',
  })
  @ApiResponse({ status: 400, description: 'Invalid agent IDs or project ID' })
  async bulkAddAgents(
    @CurrentUser() user: any,
    @Body() body: BulkAddAgentsDto,
  ) {
    const data = await this.associationService.bulkCreateAssociations(
      body.agentIds,
      user.userId,
      body.projectId,
      user.userId,
    );
    return {
      data,
      message: 'Agents added to project successfully',
    };
  }

  @Get('agents')
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Get all agents working with builder',
    description:
      'Retrieve list of all agents associated with builder across all projects or filter by specific project',
  })
  @ApiQuery({
    name: 'projectId',
    required: false,
    description: 'Filter agents by specific project ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Agents list retrieved successfully',
  })
  async getBuilderAgents(
    @CurrentUser() user: any,
    @Query('projectId') projectId?: string,
  ) {
    const data = await this.associationService.getBuilderAgents(
      user.userId,
      projectId,
    );
    return {
      data,
      message: 'Agents retrieved successfully',
    };
  }

  @Get('projects/:projectId/agents')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ summary: 'Get agents for specific project' })
  @ApiResponse({ status: 200, description: 'Project agents retrieved' })
  async getProjectAgents(
    @CurrentUser() user: any,
    @Param('projectId') projectId: string,
  ) {
    const data = await this.associationService.getProjectAgents(projectId);
    return {
      data,
      message: 'Project agents retrieved successfully',
    };
  }

  @Delete('agents/:associationId')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ summary: 'Remove agent from project' })
  @ApiResponse({ status: 200, description: 'Agent removed successfully' })
  async removeAgent(
    @CurrentUser() user: any,
    @Param('associationId') associationId: string,
  ) {
    const data =
      await this.associationService.removeAssociationById(associationId);
    return {
      data,
      message: 'Agent removed from project successfully',
    };
  }

  @Get('requirements')
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Get requirements for builder projects',
    description:
      'Retrieve buyer requirements related to builder projects with pagination and status filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by requirement status',
  })
  @ApiResponse({
    status: 200,
    description: 'Requirements retrieved successfully with pagination',
  })
  async getBuilderRequirements(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    // Note: This requires RequirementService to be injected
    // For now, return placeholder
    return {
      data: {
        message:
          'Requirements endpoint - integrate with RequirementService.findAllForBuilder',
      },
      message: 'Requirements retrieved successfully',
    };
  }

  @Get('leads')
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Get leads for builder projects',
    description:
      'Retrieve all leads generated for builder projects with pagination and status filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by lead status',
  })
  @ApiResponse({
    status: 200,
    description: 'Leads retrieved successfully with pagination',
  })
  async getBuilderLeads(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    // Note: This requires LeadService to be injected
    // For now, return placeholder
    return {
      data: {
        message:
          'Leads endpoint - integrate with LeadService.findAllForBuilder',
      },
      message: 'Leads retrieved successfully',
    };
  }
}

// Admin endpoints
@ApiTags('Builder by Admin')
@ApiBearerAuth()
@Controller('builder-by-admin')
@UseGuards(jwtGuard, RolesGuard)
export class BuilderAdminController {
  constructor(private readonly builderService: BuilderService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new builder',
    description: 'Admin creates a new builder/developer account in the system',
  })
  @ApiResponse({ status: 201, description: 'Builder created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createBuilderDto: CreateBuilderDto) {
    return this.builderService.create(createBuilderDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all builders with pagination and filters',
    description:
      'Retrieve complete list of builders with advanced filtering, sorting, and search capabilities',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by company name or email',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiResponse({
    status: 200,
    description: 'Builders retrieved successfully with pagination',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('isActive') isActive?: boolean,
  ) {
    return this.builderService.findAll(
      page,
      limit,
      search,
      sort,
      order,
      isActive !== undefined ? { isActive } : undefined,
    );
  }

  @Get('builder/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a builder by ID' })
  findOne(@Param('id') id: string) {
    return this.builderService.findOne(id);
  }

  @Patch('builder/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a builder' })
  update(@Param('id') id: string, @Body() updateBuilderDto: UpdateBuilderDto) {
    return this.builderService.update(id, updateBuilderDto);
  }

  @Delete('builder/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a builder' })
  remove(@Param('id') id: string) {
    return this.builderService.remove(id);
  }

  @Get('builder/:id/properties')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all properties by builder ID',
    description:
      'Retrieve all properties listed by a specific builder with pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Builder properties retrieved successfully',
  })
  async getBuilderProperties(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.builderService.getBuilderProperties(
      id,
      page,
      limit,
    );
    return {
      data,
      message: 'Builder properties retrieved successfully',
    };
  }

  @Get('builder/:id/projects')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all projects by builder ID',
    description:
      'Retrieve all projects/developments created by a specific builder with pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Builder projects retrieved successfully',
  })
  async getBuilderProjects(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.builderService.getBuilderProjects(id, page, limit);
    return {
      data,
      message: 'Builder projects retrieved successfully',
    };
  }

  @Get('builder/:id/inquiries')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all inquiries for builder properties/projects',
    description:
      'Retrieve all customer inquiries received for properties and projects belonging to the builder',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Builder inquiries retrieved successfully',
  })
  async getBuilderInquiries(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.builderService.getBuilderInquiries(id, page, limit);
    return {
      data,
      message: 'Builder inquiries retrieved successfully',
    };
  }

  @Get('builder/:id/bounties')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all bounties for builder projects',
    description:
      'Retrieve all bounty/reward programs created by the builder for their projects',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Builder bounties retrieved successfully',
  })
  async getBuilderBounties(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.builderService.getBuilderBounties(id, page, limit);
    return {
      data,
      message: 'Builder bounties retrieved successfully',
    };
  }
}
