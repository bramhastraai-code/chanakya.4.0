import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { RequirementService } from './requirement.service';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { RequirementStatus } from './enum/requirement.enum';

// Agent Controller - Browse requirements
@ApiTags('Agent')
@ApiBearerAuth()
@Controller('agent/requirements')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class AgentRequirementController {
  constructor(private readonly requirementService: RequirementService) {}

  @Get()
  @ApiOperation({
    summary: 'Browse buyer requirements (filtered by agent associations)',
    description:
      'View requirements from: public listings, associated builders/projects, and peer agents under same builders',
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
  @ApiQuery({
    name: 'propertyType',
    required: false,
    type: String,
    description: 'Filter by property type',
  })
  @ApiQuery({
    name: 'transactionType',
    required: false,
    type: String,
    description: 'Filter by transaction type (buy/rent)',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    type: String,
    description: 'Filter by location',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: RequirementStatus,
    description: 'Filter by requirement status',
  })
  @ApiResponse({
    status: 200,
    description: 'Requirements retrieved successfully with pagination',
  })
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('propertyType') propertyType?: string,
    @Query('transactionType') transactionType?: string,
    @Query('location') location?: string,
    @Query('status') status?: RequirementStatus,
  ) {
    const data = await this.requirementService.findAllForAgent(user.userId, {
      page,
      limit,
      propertyType,
      transactionType,
      location,
      status,
    });
    return {
      data,
      message: 'Requirements retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get requirement details with matched properties',
    description: 'View complete buyer requirement details including budget, location preferences, and AI-matched property suggestions'
  })
  @ApiResponse({ status: 200, description: 'Requirement details with property matches retrieved' })
  @ApiResponse({ status: 404, description: 'Requirement not found or not accessible to agent' })
  async findOne(@Param('id') id: string) {
    const data = await this.requirementService.findOne(id);
    return {
      data,
      message: 'Requirement details retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Post new requirement' })
  @ApiResponse({ status: 201, description: 'Requirement created successfully' })
  async create(
    @Body() createRequirementDto: CreateRequirementDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.requirementService.create(
      user.userId,
      createRequirementDto,
    );
    return {
      data,
      message: 'Requirement created successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update requirement' })
  @ApiResponse({ status: 200, description: 'Requirement updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateRequirementDto: UpdateRequirementDto,
  ) {
    const data = await this.requirementService.update(id, updateRequirementDto);
    return {
      data,
      message: 'Requirement updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete requirement' })
  @ApiResponse({ status: 200, description: 'Requirement deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.requirementService.remove(id);
    return {
      data: null,
      message: 'Requirement deleted successfully',
    };
  }

  @Post(':id/accept')
  @ApiOperation({ 
    summary: 'Accept a requirement',
    description: 'Agent claims ownership of a requirement to work on finding matching properties for the buyer'
  })
  @ApiResponse({
    status: 200,
    description: 'Requirement accepted and assigned to agent for property search',
  })
  @ApiResponse({ status: 409, description: 'Requirement already accepted by another agent' })
  async acceptRequirement(@Param('id') id: string, @CurrentUser() user: any) {
    const data = await this.requirementService.acceptRequirement(
      user.userId,
      id,
    );
    return {
      data,
      message: 'Requirement accepted successfully',
    };
  }

  @Post(':id/decline')
  @ApiOperation({ 
    summary: 'Decline/reopen an accepted requirement',
    description: 'Agent releases a previously accepted requirement back to the pool for other agents to accept'
  })
  @ApiResponse({
    status: 200,
    description: 'Requirement reopened and available for other agents to accept',
  })
  @ApiResponse({ status: 403, description: 'Can only decline requirements accepted by yourself' })
  async declineRequirement(@Param('id') id: string, @CurrentUser() user: any) {
    const data = await this.requirementService.declineRequirement(
      user.userId,
      id,
    );
    return {
      data,
      message: 'Requirement reopened successfully',
    };
  }

  @Get('accepted/list')
  @ApiOperation({ 
    summary: 'Get requirements accepted by this agent',
    description: 'Retrieve all buyer requirements currently assigned to the authenticated agent with filtering options'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'propertyType', required: false, type: String, description: 'Filter by property type (apartment, villa, plot, etc.)' })
  @ApiQuery({ name: 'transactionType', required: false, type: String, description: 'Filter by transaction type (BUYING, SELLING, RENTING)' })
  @ApiQuery({ name: 'location', required: false, type: String, description: 'Filter by preferred location' })
  @ApiResponse({
    status: 200,
    description: 'Agent assigned requirements retrieved with pagination',
  })
  async getAcceptedRequirements(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('propertyType') propertyType?: string,
    @Query('transactionType') transactionType?: string,
    @Query('location') location?: string,
  ) {
    const data = await this.requirementService.getAcceptedRequirements(
      user.userId,
      {
        page,
        limit,
        propertyType,
        transactionType,
        location,
      },
    );
    return {
      data,
      message: 'Accepted requirements retrieved successfully',
    };
  }
}

// User Controller - Post and manage requirements
@ApiTags('User')
@ApiBearerAuth()
@Controller('customer/requirements')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class UserRequirementController {
  constructor(private readonly requirementService: RequirementService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Post new requirement',
    description: 'Customer posts their property buying/renting requirement with budget, location, and preferences for agents to view'
  })
  @ApiResponse({ status: 201, description: 'Requirement created and shared with matching agents' })
  @ApiResponse({ status: 400, description: 'Invalid requirement data or missing required fields' })
  async create(
    @Body() createRequirementDto: CreateRequirementDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.requirementService.create(
      user.userId,
      createRequirementDto,
    );
    return {
      data,
      message: 'Requirement created successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update requirement' })
  @ApiResponse({ status: 200, description: 'Requirement updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateRequirementDto: UpdateRequirementDto,
  ) {
    const data = await this.requirementService.update(id, updateRequirementDto);
    return {
      data,
      message: 'Requirement updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete requirement' })
  @ApiResponse({ status: 200, description: 'Requirement deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.requirementService.remove(id);
    return {
      data: null,
      message: 'Requirement deleted successfully',
    };
  }
}
