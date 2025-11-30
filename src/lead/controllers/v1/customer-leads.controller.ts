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
} from '@nestjs/swagger';
import { LeadV1Service } from '../../services/lead-v1.service';
import { CreateLeadDto } from '../../dto/v1/lead.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('User Leads')
@ApiBearerAuth()
@Controller('customer/leads')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class UserLeadsController {
  constructor(private readonly leadService: LeadV1Service) {}

  @Post()
  @ApiOperation({ summary: 'Create lead inquiry for a property' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  async create(@CurrentUser() user: any, @Body() dto: CreateLeadDto) {
    const data = await this.leadService.create(user.userId, dto, 'mobile_app');
    return {
      success: true,
      message: 'Your inquiry has been submitted successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get my submitted leads' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Leads retrieved successfully' })
  async getMyLeads(@CurrentUser() user: any, @Query() filters: any) {
    const data = await this.leadService.findByUser(user.userId, filters);
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details' })
  @ApiResponse({ status: 200, description: 'Lead details' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.leadService.findOne(id);
    return {
      success: true,
      data,
    };
  }
}
