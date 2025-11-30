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
  @ApiOperation({ summary: 'Browse buyer requirements' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'propertyType', required: false, type: String })
  @ApiQuery({ name: 'transactionType', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: RequirementStatus })
  @ApiResponse({
    status: 200,
    description: 'Requirements retrieved successfully',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('propertyType') propertyType?: string,
    @Query('transactionType') transactionType?: string,
    @Query('location') location?: string,
    @Query('status') status?: RequirementStatus,
  ) {
    const data = await this.requirementService.findAll(
      page,
      limit,
      propertyType,
      transactionType,
      location,
      status,
    );
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get requirement details with matched properties' })
  @ApiResponse({ status: 200, description: 'Requirement details retrieved' })
  async findOne(@Param('id') id: string) {
    const data = await this.requirementService.findOne(id);
    return {
      success: true,
      data,
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
      success: true,
      message: 'Requirement created successfully',
      data,
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
      success: true,
      message: 'Requirement updated successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete requirement' })
  @ApiResponse({ status: 200, description: 'Requirement deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.requirementService.remove(id);
    return {
      success: true,
      message: 'Requirement deleted successfully',
    };
  }
}
