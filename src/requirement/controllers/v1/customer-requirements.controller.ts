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
  @ApiOperation({ summary: 'Post a new property requirement' })
  @ApiResponse({ status: 201, description: 'Requirement posted successfully' })
  async create(@CurrentUser() user: any, @Body() dto: CreateRequirementDto) {
    const data = await this.requirementService.create(user.userId, dto);
    return {
      success: true,
      message: 'Requirement posted successfully. We will find matches for you.',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get my requirements' })
  @ApiQuery({ name: 'status', enum: RequirementStatus, required: false })
  @ApiResponse({
    status: 200,
    description: 'Requirements retrieved successfully',
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
      success: true,
      data,
    };
  }

  @Get(':id/matches')
  @ApiOperation({ summary: 'Get matched properties for a requirement' })
  @ApiResponse({ status: 200, description: 'Matches retrieved successfully' })
  async getMatches(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.requirementService.getMatches(id, user.userId);
    return {
      success: true,
      data,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update requirement' })
  @ApiResponse({ status: 200, description: 'Requirement updated successfully' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateRequirementDto,
  ) {
    const data = await this.requirementService.update(id, user.userId, dto);
    return {
      success: true,
      message: 'Requirement updated successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete requirement' })
  @ApiResponse({ status: 200, description: 'Requirement deleted successfully' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.requirementService.delete(id, user.userId);
    return {
      success: true,
      ...data,
    };
  }
}
