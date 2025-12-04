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
import { RequirementV1Service } from '../../services/requirement-v1.service';
import {
  CreateRequirementDto,
  UpdateRequirementDto,
} from '../../dto/v1/requirement.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { RequirementStatus } from '../../enum/requirement.enum';

@ApiTags('User Requirements')
@ApiBearerAuth()
@Controller('customer/requirements')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class UserRequirementsController {
  constructor(private readonly requirementService: RequirementV1Service) {}

  @Post()
  @ApiOperation({ 
    summary: 'Post a new property requirement',
    description: 'Customer creates a property requirement specifying their buying/renting needs, budget, and preferences'
  })
  @ApiResponse({ status: 201, description: 'Requirement posted and agents will be matched automatically' })
  @ApiResponse({ status: 400, description: 'Invalid requirement data' })
  async create(@CurrentUser() user: any, @Body() dto: CreateRequirementDto) {
    const data = await this.requirementService.create(user.userId, dto);
    return {
      data,
      message: 'Requirement posted successfully. We will find matches for you.',
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get my requirements',
    description: 'Retrieve all property requirements posted by the customer with optional status filtering'
  })
  @ApiQuery({ name: 'status', enum: RequirementStatus, required: false, description: 'Filter by requirement status (open, in-progress, closed)' })
  @ApiResponse({
    status: 200,
    description: 'Customer requirements retrieved with matched properties count',
  })
  async getMyRequirements(
    @CurrentUser() user: any,
    @Query('status') status?: RequirementStatus,
  ) {
    const data = await this.requirementService.findMyRequirements(
      user.userId,
      status,
    );
    return {
      data,
      message: 'Requirements retrieved successfully',
    };
  }

  @Get(':id/matches')
  @ApiOperation({ 
    summary: 'Get matched properties for a requirement',
    description: 'View AI-matched properties that fit the customer requirement criteria including location, budget, and specifications'
  })
  @ApiResponse({ status: 200, description: 'Matched properties retrieved with similarity scores' })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async getMatches(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.requirementService.getMatches(id, user.userId);
    return {
      data,
      message: 'Matches retrieved successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update requirement',
    description: 'Modify property requirement details including budget, location, or specifications. Triggers re-matching with properties'
  })
  @ApiResponse({ status: 200, description: 'Requirement updated and new matches found' })
  @ApiResponse({ status: 403, description: 'Can only update your own requirements' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateRequirementDto,
  ) {
    const data = await this.requirementService.update(id, user.userId, dto);
    return {
      data,
      message: 'Requirement updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete requirement',
    description: 'Permanently remove property requirement. Active agents working on this requirement will be notified'
  })
  @ApiResponse({ status: 200, description: 'Requirement deleted and agents notified' })
  @ApiResponse({ status: 403, description: 'Can only delete your own requirements' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.requirementService.delete(id, user.userId);
    return {
      data,
      message: 'Requirement deleted successfully',
    };
  }
}
