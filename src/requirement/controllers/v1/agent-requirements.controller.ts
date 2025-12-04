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
  @ApiOperation({ summary: 'Search customer requirements (leads)' })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'propertyType', required: false })
  @ApiQuery({ name: 'minBudget', required: false, type: Number })
  @ApiQuery({ name: 'maxBudget', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Requirements retrieved successfully',
  })
  async search(@Query() filters: any) {
    const data = await this.requirementService.search(filters);
    return {
      data,
      message: 'Requirements retrieved successfully',
    };
  }
}
