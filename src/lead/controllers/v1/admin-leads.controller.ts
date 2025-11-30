import {
  Controller,
  Get,
  Post,
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
  ApiBody,
} from '@nestjs/swagger';
import { LeadV1Service } from '../../services/lead-v1.service';
import { AssignLeadDto } from '../../dto/v1/lead.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { LeadStatus } from '../../enum/lead-status.enum';

@ApiTags('Admin Leads')
@ApiBearerAuth()
@Controller('admin/leads')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminLeadsController {
  constructor(private readonly leadService: LeadV1Service) {}

  @Get()
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
      success: true,
      data,
    };
  }

  @Get('unassigned')
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
      success: true,
      data,
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get platform-wide lead statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    const data = await this.leadService.getAdminStats();
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details' })
  @ApiResponse({ status: 200, description: 'Lead details' })
  async findOne(@Param('id') id: string) {
    const data = await this.leadService.findOne(id);
    return {
      success: true,
      data,
    };
  }

  @Post(':id/assign')
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
      success: true,
      message: 'Lead assigned successfully',
      data,
    };
  }
}
