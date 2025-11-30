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
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PropertyService } from './property.service';
import { PropertyEnhancedService } from './property-enhanced.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Status } from 'src/common/enum/status.enum';

// User Controller - Public property browsing
@ApiTags('User')
@Controller('api/customer/properties')
export class UserPropertyController {
  constructor(private readonly propertyService: PropertyEnhancedService) {}

  @Get()
  @ApiOperation({ summary: 'Browse all properties with advanced filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'propertyType', required: false, type: String })
  @ApiQuery({ name: 'propertyPurpose', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'bedrooms', required: false, type: Number })
  @ApiQuery({ name: 'bathrooms', required: false, type: Number })
  @ApiQuery({ name: 'minArea', required: false, type: Number })
  @ApiQuery({ name: 'maxArea', required: false, type: Number })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'createdAt', 'totalArea', 'views'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('propertyType') propertyType?: string,
    @Query('propertyPurpose') propertyPurpose?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('bedrooms') bedrooms?: number,
    @Query('bathrooms') bathrooms?: number,
    @Query('minArea') minArea?: number,
    @Query('maxArea') maxArea?: number,
    @Query('featured') featured?: boolean,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.propertyService.findAllWithFilters({
      page,
      limit,
      search,
      city,
      state,
      propertyType,
      propertyPurpose,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      featured,
      sortBy,
      sortOrder,
      status: Status.ACTIVE, // Only show active properties to customers
    });

    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property details by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property details retrieved' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.propertyService.findOneWithDetails(id);

    if (!data) {
      throw new NotFoundException('Property not found');
    }

    // Increment view count
    await this.propertyService.incrementViews(id);

    return {
      success: true,
      data,
    };
  }
}

// Agent Controller - Property management for agents
@ApiTags('Agent')
@ApiBearerAuth()
@Controller('api/agent/properties')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class AgentPropertyController {
  constructor(
    private readonly propertyService: PropertyEnhancedService,
    private readonly propertyServiceLegacy: PropertyService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get agent's properties" })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'createdAt', 'views'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
  })
  async getMyProperties(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: Status,
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.propertyService.findAgentProperties(
      user.userId,
      page,
      limit,
      status,
      search,
      sortBy,
      sortOrder,
    );

    return {
      success: true,
      data,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new property' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.propertyService.createProperty(
      createPropertyDto,
      user.userId,
    );

    return {
      success: true,
      message: 'Property created successfully',
      data,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update property' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @CurrentUser() user: any,
  ) {
    // Verify ownership
    const property = await this.propertyServiceLegacy.findOne(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId?.toString() !== user.userId) {
      throw new ForbiddenException(
        'You do not have permission to update this property',
      );
    }

    const data = await this.propertyService.updateProperty(
      id,
      updatePropertyDto,
      user.userId,
    );

    return {
      success: true,
      message: 'Property updated successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete property' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    // Verify ownership
    const property = await this.propertyServiceLegacy.findOne(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId?.toString() !== user.userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this property',
      );
    }

    await this.propertyServiceLegacy.remove(id);

    return {
      success: true,
      message: 'Property deleted successfully',
    };
  }

  @Post(':id/bookmark')
  @ApiOperation({ summary: 'Bookmark property' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property bookmarked successfully' })
  async bookmarkProperty(@Param('id') id: string, @CurrentUser() user: any) {
    const data = await this.propertyService.bookmarkProperty(user.userId, id);

    return {
      success: true,
      message: 'Property bookmarked successfully',
      data,
    };
  }

  @Delete(':id/bookmark')
  @ApiOperation({ summary: 'Remove bookmark' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Bookmark removed successfully' })
  async removeBookmark(@Param('id') id: string, @CurrentUser() user: any) {
    const data = await this.propertyService.removeBookmark(user.userId, id);

    return {
      success: true,
      message: 'Bookmark removed successfully',
      data,
    };
  }

  @Get('bookmarked/list')
  @ApiOperation({ summary: 'Get bookmarked properties' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Bookmarked properties retrieved' })
  async getBookmarkedProperties(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const data = await this.propertyService.getBookmarkedProperties(
      user.userId,
      page,
      limit,
    );

    return {
      success: true,
      data,
    };
  }

  @Get('top-locations')
  @ApiOperation({ summary: 'Get top property locations' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Top locations retrieved' })
  async getTopLocations(@Query('limit') limit: number = 10) {
    const data = await this.propertyService.getTopLocations(limit);

    return {
      success: true,
      data,
    };
  }

  @Get(':id/nearby')
  @ApiOperation({ summary: 'Get nearby properties' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Nearby properties retrieved' })
  async getNearbyProperties(
    @Param('id') id: string,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.propertyService.getNearbyProperties(id, limit);

    return {
      success: true,
      data,
    };
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get personalized property recommendations' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved' })
  async getRecommendations(
    @CurrentUser() user: any,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.propertyService.getRecommendations(
      user.userId,
      limit,
    );

    return {
      success: true,
      data,
    };
  }
}

// Builder Controller - Builder's property management
@ApiTags('Builder')
@ApiBearerAuth()
@Controller('api/builder/properties')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.BUILDER)
export class BuilderPropertyController {
  constructor(private readonly propertyService: PropertyEnhancedService) {}

  @Get()
  @ApiOperation({ summary: "Get builder's properties" })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'createdAt', 'views'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
  })
  async getBuilderProperties(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: Status,
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.propertyService.findBuilderProperties(
      user.userId,
      page,
      limit,
      status,
      search,
      sortBy,
      sortOrder,
    );

    return {
      success: true,
      data,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new property' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.propertyService.createBuilderProperty(
      createPropertyDto,
      user.userId,
    );

    return {
      success: true,
      message: 'Property created successfully',
      data,
    };
  }
}

// Admin Controller - Property approval and management
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('api/admin/properties')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminPropertyController {
  constructor(private readonly propertyService: PropertyEnhancedService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Get pending properties for approval' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Pending properties retrieved' })
  async getPendingProperties(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const data = await this.propertyService.findPendingProperties(page, limit);

    return {
      success: true,
      data,
    };
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve property' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property approved successfully' })
  async approve(@Param('id') id: string, @CurrentUser() user: any) {
    const data = await this.propertyService.approveProperty(id, user.userId);

    return {
      success: true,
      message: 'Property approved successfully',
      data,
    };
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject property' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property rejected successfully' })
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    const data = await this.propertyService.rejectProperty(
      id,
      reason,
      user.userId,
    );

    return {
      success: true,
      message: 'Property rejected successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties (admin view)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'All properties retrieved' })
  async getAllProperties(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: Status,
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.propertyService.findAllForAdmin(
      page,
      limit,
      status,
      search,
      sortBy,
      sortOrder,
    );

    return {
      success: true,
      data,
    };
  }
}
