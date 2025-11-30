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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { LeadStatus } from './enum/lead-status.enum';

@ApiTags('Agent')
@ApiBearerAuth()
@Controller('agent/leads')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @ApiOperation({ summary: 'Create new lead' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  async create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user: any) {
    const data = await this.leadService.create(createLeadDto, user.userId);
    return {
      success: true,
      message: 'Lead created successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads for agent' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: LeadStatus })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Leads retrieved successfully' })
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: LeadStatus,
    @Query('search') search?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const data = await this.leadService.findAll(
      user.userId,
      page,
      limit,
      status,
      search,
      dateFrom,
      dateTo,
    );
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details with activity timeline' })
  @ApiResponse({ status: 200, description: 'Lead details retrieved' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const data = await this.leadService.findOne(id, user.userId);
    return {
      success: true,
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead status and notes' })
  @ApiResponse({ status: 200, description: 'Lead updated successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.leadService.update(id, updateLeadDto, user.userId);
    return {
      success: true,
      message: 'Lead updated successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  @ApiResponse({ status: 200, description: 'Lead deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.leadService.remove(id, user.userId);
    return {
      success: true,
      message: 'Lead deleted successfully',
    };
  }
}
