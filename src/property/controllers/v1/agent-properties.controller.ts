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
import { PropertyV1Service } from '../../services/property-v1.service';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
} from '../../dto/v1/property.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Agent Properties')
@ApiBearerAuth()
@Controller('agent/properties')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class AgentPropertiesController {
  constructor(private readonly propertyService: PropertyV1Service) {}

  @Post()
  @ApiOperation({ summary: 'Create new property listing' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  async create(@CurrentUser() user: any, @Body() dto: CreatePropertyDto) {
    const data = await this.propertyService.create(user.userId, dto);
    return {
      success: true,
      message: 'Property created successfully. Pending admin approval.',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all my properties' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({
    name: 'approvalStatus',
    required: false,
    enum: ['pending', 'approved', 'rejected'],
  })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
  })
  async findMyProperties(@CurrentUser() user: any, @Query() filters: any) {
    const data = await this.propertyService.findByOwner(user.userId, filters);
    return {
      success: true,
      data,
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get my property statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getMyStats(@CurrentUser() user: any) {
    const data = await this.propertyService.getOwnerStats(user.userId);
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property details by ID' })
  @ApiResponse({ status: 200, description: 'Property details' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.propertyService.findOne(id);
    return {
      success: true,
      data,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update my property' })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to update this property',
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    const data = await this.propertyService.update(id, user.userId, dto);
    return {
      success: true,
      message: 'Property updated successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete my property' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to delete this property',
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.propertyService.delete(id, user.userId);
    return {
      success: true,
      ...data,
    };
  }
}
