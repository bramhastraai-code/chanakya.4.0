import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { LeadV1Service } from '../../services/lead-v1.service';
import { UpdateLeadDto, AddActivityDto } from '../../dto/v1/lead.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { LeadStatus } from '../../enum/lead-status.enum';

@ApiTags('Agent Leads')
@ApiBearerAuth()
@Controller('agent/leads')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class AgentLeadsController {
  constructor(private readonly leadService: LeadV1Service) {}

  @Get()
  @ApiOperation({
    summary: 'Get my assigned leads',
    description:
      'Retrieve all leads assigned to the authenticated agent with filtering and pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 20,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    enum: LeadStatus,
    required: false,
    description: 'Filter by lead status',
  })
  @ApiQuery({
    name: 'isQualified',
    type: Boolean,
    required: false,
    description: 'Filter by qualification status',
  })
  @ApiResponse({
    status: 200,
    description: 'Leads retrieved successfully with pagination',
  })
  async getMyLeads(@CurrentUser() user: any, @Query() filters: any) {
    const data = await this.leadService.findByAgent(user.userId, filters);
    return {
      data,
      message: 'Leads retrieved successfully',
    };
  }

  @Get('statistics')
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

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details with activity timeline' })
  @ApiResponse({ status: 200, description: 'Lead details' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.leadService.findOne(id);
    return {
      data,
      message: 'Lead details retrieved successfully',
    };
  }

  @Put(':id')
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

  @Post(':id/activities')
  @ApiOperation({
    summary: 'Add activity to lead (call, meeting, note, etc.)',
    description:
      'Log an activity or interaction with the lead for tracking and follow-up',
  })
  @ApiBody({ type: AddActivityDto })
  @ApiResponse({
    status: 201,
    description: 'Activity logged successfully in lead timeline',
  })
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

  @Patch(':id/qualify')
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

  @Patch(':id/unqualify')
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
}
