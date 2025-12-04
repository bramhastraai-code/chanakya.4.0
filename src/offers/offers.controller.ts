import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { jwtGuard } from '../core/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enum/user-role.enum';

@ApiTags('Offers - Builder')
@ApiBearerAuth()
@Controller('builder/offers')
@UseGuards(jwtGuard, RolesGuard)
export class BuilderOffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Create new offer/incentive for project',
    description:
      'Builder creates an incentive offer for agents working on their project',
  })
  @ApiResponse({
    status: 201,
    description: 'Offer created successfully with active status',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only create offers for own projects',
  })
  async create(@CurrentUser() user: any, @Body() dto: CreateOfferDto) {
    const data = await this.offersService.create(user, dto);
    return {
      data,
      message: 'Offer created successfully',
    };
  }

  @Get()
  @Roles(UserRole.BUILDER)
  @ApiOperation({
    summary: 'Get all offers for builder projects',
    description:
      'Retrieve all offers created by the builder with optional filters',
  })
  @ApiQuery({
    name: 'projectId',
    required: false,
    description: 'Filter by specific project',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by offer status (active, paused, closed, expired)',
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
  @ApiResponse({
    status: 200,
    description: 'Offers retrieved successfully with pagination',
  })
  async findAll(
    @CurrentUser() user: any,
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const data = await this.offersService.findAll({
      builderId: user.userId,
      projectId,
      status,
      page,
      limit,
    });
    return {
      data,
      message: 'Offers retrieved successfully',
    };
  }

  @Get(':id')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ 
    summary: 'Get offer details',
    description: 'Retrieve complete details of a specific offer including terms, conditions, and performance metrics'
  })
  @ApiResponse({ status: 200, description: 'Offer details retrieved with performance data' })
  @ApiResponse({ status: 404, description: 'Offer not found or not owned by builder' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.offersService.findOne(id, user);
    return {
      data,
      message: 'Offer details retrieved successfully',
    };
  }

  @Patch(':id')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ 
    summary: 'Update offer',
    description: 'Modify offer details, status (active/paused/closed), or terms. Cannot update expired offers'
  })
  @ApiResponse({ status: 200, description: 'Offer updated successfully with new terms' })
  @ApiResponse({ status: 403, description: 'Cannot update offer for other builders projects' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateOfferDto,
  ) {
    const data = await this.offersService.update(id, user, dto);
    return {
      data,
      message: 'Offer updated successfully',
    };
  }

  @Delete(':id')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ 
    summary: 'Delete offer',
    description: 'Permanently remove an offer. Consider pausing instead of deleting for historical tracking'
  })
  @ApiResponse({ status: 200, description: 'Offer deleted successfully and removed from agent visibility' })
  @ApiResponse({ status: 403, description: 'Cannot delete offer from other builders projects' })
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.offersService.remove(id, user);
    return {
      data,
      message: 'Offer deleted successfully',
    };
  }

  @Get('project/:projectId')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ 
    summary: 'Get offers by project',
    description: 'Retrieve all incentive offers configured for a specific project with optional status filtering'
  })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by offer status (active, paused, closed, expired)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Project offers retrieved with pagination' })
  @ApiResponse({ status: 403, description: 'Project does not belong to builder' })
  async findByProject(
    @Param('projectId') projectId: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const data = await this.offersService.findByProject(projectId, {
      status,
      page,
      limit,
    });
    return {
      data,
      message: 'Project offers retrieved successfully',
    };
  }
}

@ApiTags('Offers - Agent')
@ApiBearerAuth()
@Controller('agent/offers')
@UseGuards(jwtGuard, RolesGuard)
export class AgentOffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @Roles(UserRole.AGENT)
  @ApiOperation({
    summary: 'Get all offers for associated projects',
    description:
      'Agents can only view offers from builders and projects they are associated with',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by offer status',
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
    description: 'Offers from associated projects retrieved successfully',
  })
  async findAll(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const data = await this.offersService.findAllForAgent(user.userId, {
      status,
      page,
      limit,
    });
    return {
      data,
      message: 'Offers retrieved successfully',
    };
  }

  @Get(':id')
  @Roles(UserRole.AGENT)
  @ApiOperation({ 
    summary: 'Get offer details',
    description: 'View complete details of an offer including incentive amount, terms, conditions, and validity period'
  })
  @ApiResponse({ status: 200, description: 'Offer details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Offer not found or not accessible to agent' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.offersService.findOne(id, user);
    return {
      data,
      message: 'Offer details retrieved successfully',
    };
  }
}

@ApiTags('Offers - Admin')
@ApiBearerAuth()
@Controller('admin/offers')
@UseGuards(jwtGuard, RolesGuard)
export class AdminOffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Create new offer (Admin)',
    description: 'Admin creates incentive offer on behalf of any builder for any project'
  })
  @ApiResponse({ status: 201, description: 'Offer created successfully by admin' })
  @ApiResponse({ status: 400, description: 'Invalid offer data or project not found' })
  async create(@CurrentUser() user: any, @Body() dto: CreateOfferDto) {
    const data = await this.offersService.create(user, dto);
    return {
      data,
      message: 'Offer created successfully',
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get all offers (Admin)',
    description: 'Admin can view all offers across all builders and projects with advanced filtering'
  })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by specific project' })
  @ApiQuery({ name: 'builderId', required: false, description: 'Filter by specific builder' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by offer status (active, paused, closed, expired)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'All offers retrieved with pagination and filters applied' })
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('builderId') builderId?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const data = await this.offersService.findAll({
      projectId,
      builderId,
      status,
      page,
      limit,
    });
    return {
      data,
      message: 'Offers retrieved successfully',
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get offer details (Admin)',
    description: 'Admin retrieves complete offer details including performance metrics and agent engagement data'
  })
  @ApiResponse({ status: 200, description: 'Offer details retrieved with full analytics' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.offersService.findOne(id);
    return {
      data,
      message: 'Offer details retrieved successfully',
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Update offer (Admin)',
    description: 'Admin can modify any offer details, status, or terms regardless of builder ownership'
  })
  @ApiResponse({ status: 200, description: 'Offer updated successfully by admin' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateOfferDto,
  ) {
    const data = await this.offersService.update(id, user, dto);
    return {
      data,
      message: 'Offer updated successfully',
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Delete offer (Admin)',
    description: 'Admin permanently removes an offer from the system across all builders and projects'
  })
  @ApiResponse({ status: 200, description: 'Offer deleted successfully by admin' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.offersService.remove(id, user);
    return {
      data,
      message: 'Offer deleted successfully',
    };
  }

  @Post('update-expired')
  @Roles(UserRole.ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update expired offers status' })
  @ApiResponse({ status: 200, description: 'Expired offers updated' })
  async updateExpired() {
    const data = await this.offersService.updateExpiredOffers();
    return {
      data,
      message: 'Expired offers updated successfully',
    };
  }
}
