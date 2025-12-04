import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import {
  UpdateLeadDto,
  AssignLeadDto,
  AddActivityDto,
} from './dto/v1/lead.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { LeadStatus } from './enum/lead-status.enum';

@ApiTags('Lead Management')
@ApiBearerAuth()
@Controller()
@UseGuards(jwtGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  // --- Admin Endpoints ---

  @Get('admin/leads')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all leads with filters' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'status', enum: LeadStatus, required: false })
  @ApiQuery({
    name: 'source',
    enum: ['website', 'mobile_app', 'direct', 'referral'],
    required: false,
  })
  @ApiQuery({ name: 'isQualified', type: Boolean, required: false })
  @ApiResponse({ status: 200, description: 'Leads retrieved successfully' })
  async getAllLeads(@Query() filters: any) {
    const data = await this.leadService.findAll(filters);
    return {
      data,
      message: 'Leads retrieved successfully',
    };
  }

  @Get('admin/leads/unassigned')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get unassigned leads' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Unassigned leads retrieved' })
  async getUnassigned(@Query() filters: any) {
    const data = await this.leadService.findAll({
      ...filters,
      assignedTo: null,
    });
    return {
      data,
      message: 'Unassigned leads retrieved successfully',
    };
  }

  @Get('admin/leads/statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get platform-wide lead statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    const data = await this.leadService.getAdminStats();
    return {
      data,
      message: 'Statistics retrieved successfully',
    };
  }

  @Post('admin/leads/:id/assign')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign lead to an agent' })
  @ApiBody({ type: AssignLeadDto })
  @ApiResponse({ status: 200, description: 'Lead assigned successfully' })
  async assignLead(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: AssignLeadDto,
  ) {
    const data = await this.leadService.assignToAgent(
      id,
      dto.agentId,
      user.userId,
    );
    return {
      data,
      message: 'Lead assigned successfully',
    };
  }

  // --- Agent Endpoints ---

  @Get('agent/leads')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get my assigned leads' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'status', enum: LeadStatus, required: false })
  @ApiQuery({ name: 'isQualified', type: Boolean, required: false })
  @ApiResponse({ status: 200, description: 'Leads retrieved successfully' })
  async getMyLeads(@CurrentUser() user: any, @Query() filters: any) {
    const data = await this.leadService.findByAgent(user.userId, filters);
    return {
      data,
      message: 'Leads retrieved successfully',
    };
  }

  @Get('agent/leads/statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get my lead statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getMyStats(@CurrentUser() user: any) {
    const data = await this.leadService.getAgentStats(user.userId);
    return {
      data,
      message: 'Statistics retrieved successfully',
    };
  }

  @Put('agent/leads/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Update lead status and notes' })
  @ApiResponse({ status: 200, description: 'Lead updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to update this lead',
  })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    const data = await this.leadService.update(id, user.userId, dto);
    return {
      data,
      message: 'Lead updated successfully',
    };
  }

  @Post('agent/leads/:id/activities')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Add activity to lead (call, meeting, note, etc.)' })
  @ApiBody({ type: AddActivityDto })
  @ApiResponse({ status: 201, description: 'Activity added successfully' })
  async addActivity(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: AddActivityDto,
  ) {
    const data = await this.leadService.addActivity(id, user.userId, dto);
    return {
      data,
      message: 'Activity added successfully',
    };
  }

  @Patch('agent/leads/:id/qualify')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Mark lead as qualified' })
  @ApiResponse({ status: 200, description: 'Lead marked as qualified' })
  async markQualified(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.leadService.updateQualification(
      id,
      user.userId,
      true,
    );
    return {
      data,
      message: 'Lead marked as qualified',
    };
  }

  @Patch('agent/leads/:id/unqualify')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Mark lead as unqualified' })
  @ApiResponse({ status: 200, description: 'Lead marked as unqualified' })
  async markUnqualified(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.leadService.updateQualification(
      id,
      user.userId,
      false,
    );
    return {
      data,
      message: 'Lead marked as unqualified',
    };
  }

  // --- Customer Endpoints ---

  @Post('customer/leads')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Create lead inquiry for a property' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  async create(@CurrentUser() user: any, @Body() dto: CreateLeadDto) {
    const data = await this.leadService.create(user.userId, dto, 'mobile_app');
    return {
      data,
      message: 'Your inquiry has been submitted successfully',
    };
  }

  @Get('customer/leads')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get my submitted leads' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Leads retrieved successfully' })
  async getMySubmittedLeads(@CurrentUser() user: any, @Query() filters: any) {
    const data = await this.leadService.findByUser(user.userId, filters);
    return {
      data,
      message: 'Leads retrieved successfully',
    };
  }

  // --- Shared Endpoints ---

  @Get('leads/:id')
  @ApiOperation({ summary: 'Get lead details' })
  @ApiResponse({ status: 200, description: 'Lead details' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.leadService.findOne(id);
    return {
      data,
      message: 'Lead details retrieved successfully',
    };
  }
}
