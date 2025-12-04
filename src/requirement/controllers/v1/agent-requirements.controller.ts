import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { RequirementV1Service } from '../../services/requirement-v1.service';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Agent Requirements')
@ApiBearerAuth()
@Controller('agent/requirements')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT, UserRole.BUILDER)
export class AgentRequirementsController {
  constructor(private readonly requirementService: RequirementV1Service) {}

  @Get('search')
  @ApiOperation({ 
    summary: 'Search customer requirements (leads)',
    description: 'Agent searches for buyer/renter requirements matching their expertise and available properties with advanced filtering'
  })
  @ApiQuery({ name: 'location', required: false, description: 'Filter by preferred location (city, area, locality)' })
  @ApiQuery({ name: 'propertyType', required: false, description: 'Filter by property type (apartment, villa, plot, etc.)' })
  @ApiQuery({ name: 'minBudget', required: false, type: Number, description: 'Minimum budget in INR' })
  @ApiQuery({ name: 'maxBudget', required: false, type: Number, description: 'Maximum budget in INR' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 20, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Customer requirements retrieved with matching criteria',
  })
  async search(@Query() filters: any) {
    const data = await this.requirementService.search(filters);
    return {
      data,
      message: 'Requirements retrieved successfully',
    };
  }
}
