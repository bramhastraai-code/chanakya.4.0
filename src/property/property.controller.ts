import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  Query,
  InternalServerErrorException,
  UseInterceptors,
  Patch,
  Delete,
  HttpStatus,
  Res,
  UseGuards,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';
import { Response } from 'src/common/interceptor/response.interface';
import { Logger } from '@nestjs/common';
import { PropertySummaryDto } from './dto/recommondedProperty.dto';
import { PropertyDetailDto } from './dto/property-detail.dto';
import { Status } from 'src/common/enum/status.enum';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

// ==================== MAIN PROPERTY CONTROLLER ====================
@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
  private readonly logger = new Logger(PropertyController.name);

  constructor(
    private readonly propertyService: PropertyService,
    private readonly s3Service: S3Service,
  ) {}

  @Get('by-creator')
  @UseGuards(jwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get properties by creator (JWT) with pagination' })
  @ApiQuery({ name: 'pageSize', type: Number, required: true })
  @ApiQuery({ name: 'pageNumber', type: Number, required: true })
  @ApiQuery({ name: 'searchQuery', type: String, required: false })
  @ApiQuery({ name: 'status', type: String, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Properties created by the authenticated user',
  })
  async getPropertiesByCreator(
    @CurrentUser() user: any,
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('searchQuery') searchQuery?: string,
    @Query('status') status?: string,
  ): Promise<
    Response<{
      properties: Property[];
      totalPages: number;
      totalProperties: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    const data = await this.propertyService.findPropertiesByCreator(
      user.userId,
      pageSize,
      pageNumber,
      searchQuery,
      status,
    );
    return { data, message: 'Properties retrieved successfully' };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all properties with pagination, sorting, and search',
  })
  @ApiQuery({ name: 'pageSize', type: Number, required: true })
  @ApiQuery({ name: 'pageNumber', type: Number, required: true })
  @ApiQuery({ name: 'status', type: String, required: false })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    enum: ['createdAt', 'updatedAt'],
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'searchQuery',
    type: String,
    required: false,
    description: 'Search term for filtering properties by title or description',
  })
  @ApiOkResponse({
    description: 'List of properties retrieved successfully',
    type: Property,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'No properties found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchQuery') searchQuery?: string,
    @Query('status') status?: Status,
  ): Promise<
    Response<{
      properties: Property[];
      totalPages: number;
      totalProperties: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.propertyService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
        status,
      );
      if (!data.properties || data.properties.length === 0) {
        throw new NotFoundException('No properties found');
      }

      return { data, message: 'Successfully retrieved properties' };
    } catch (error) {
      throw error;
    }
  }

  @Get('property/:id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Property ID' })
  @ApiResponse({ status: 200, description: 'Property details', type: Property })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findOne(
    @Param('id') id: string,
  ): Promise<{ data: Property; message: string }> {
    const property = await this.propertyService.findOne(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return { data: property, message: 'Successfully retrieved property' };
  }

  @Post()
  @UseGuards(jwtGuard, RolesGuard)
  @Roles(UserRole.BUILDER, UserRole.ADMIN, UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property' })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({
    status: 201,
    description: 'Property created successfully',
    type: Property,
  })
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: any,
  ): Promise<{ data: Property; message: string }> {
    try {
      const userObjectId = new Types.ObjectId(user.userId);
      createPropertyDto.createdBy = userObjectId.toString();
      createPropertyDto.updatedBy = userObjectId.toString();
      createPropertyDto.ownerId = userObjectId.toString();

      if (user.role === UserRole.BUILDER || user.role === UserRole.AGENT) {
        createPropertyDto.builderId = userObjectId.toString();
      }

      const data = await this.propertyService.create(createPropertyDto);
      return { data, message: 'Property created successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Patch('property/:id')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles(UserRole.BUILDER, UserRole.ADMIN, UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update property by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Property ID' })
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({
    status: 200,
    description: 'Property updated successfully',
    type: Property,
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @UseInterceptors(FileInterceptor('thumbnail'), FilesInterceptor('images', 10))
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @CurrentUser() user: any,
  ): Promise<{ data: Property; message: string }> {
    try {
      const data = await this.propertyService.update(
        id,
        updatePropertyDto,
        user.userId,
      );
      return { data, message: 'Property updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the property.',
      );
    }
  }

  @Delete('property/:id')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles(UserRole.BUILDER, UserRole.ADMIN, UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete property by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Property ID' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const property = await this.propertyService.findOne(id);
      if (!property) {
        throw new NotFoundException('Property not found');
      }
      await this.propertyService.remove(id);
      return { message: 'Property deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('recommended')
  @ApiResponse({
    status: 200,
    description: 'Retrieve property summaries',
    type: [PropertySummaryDto],
  })
  async getPropertySummaries(): Promise<Response<Property[]>> {
    try {
      const data = await this.propertyService.getPropertySummaries();
      return { data, message: 'retrieve recommended property' };
    } catch (error) {
      throw error;
    }
  }

  @Get('property-by-id/:id')
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiOkResponse({ type: PropertyDetailDto })
  async getPropertyById(@Param('id') id: string): Promise<Response<any>> {
    const data = await this.propertyService.findOne(id);
    return { data, message: 'retrieve successfully ' };
  }

  @Get('property-by-city/:city')
  @ApiParam({ name: 'city', description: 'city' })
  @ApiOkResponse({ type: PropertyDetailDto })
  async getPropertyByCity(@Param('city') city: string): Promise<Response<any>> {
    const data = await this.propertyService.getPropertiesByCity(city);
    return { data, message: 'retrieve successfully ' };
  }

  @Get('region-wise')
  async getFormattedProperties(@Res() res: any) {
    try {
      const formattedProperties =
        await this.propertyService.getFormattedProperties();
      return res.status(HttpStatus.OK).json(formattedProperties);
    } catch (error) {
      this.logger.error(
        `Error fetching formatted properties: ${error.message}`,
        error.stack,
      );
      return error;
    }
  }
}

// ==================== USER/CUSTOMER PROPERTY CONTROLLER ====================
@ApiTags('User')
@Controller('customer/properties')
export class UserPropertyController {
  constructor(private readonly propertyService: PropertyService) {}

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
      status: Status.ACTIVE,
    });

    return {
      data,
      message: 'Properties retrieved successfully',
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

    await this.propertyService.incrementViews(id);

    return {
      data,
      message: 'Property details retrieved successfully',
    };
  }
}

// ==================== AGENT PROPERTY CONTROLLER ====================
@ApiTags('Agent')
@ApiBearerAuth()
@Controller('agent/properties')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class AgentPropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  @ApiOperation({
    summary: "Get builder's properties",
    description:
      'Retrieve all properties owned by the authenticated builder with advanced filtering, sorting, and pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: Status,
    description: 'Filter by property status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by property title or location',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'createdAt', 'views'],
    description: 'Field to sort by (default: createdAt)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (default: desc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully with pagination',
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
      data,
      message: 'Properties retrieved successfully',
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
      data,
      message: 'Statistics retrieved successfully',
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
      data,
      message: 'Property created successfully',
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
    const property = await this.propertyService.findOne(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const data = await this.propertyService.update(
      id,
      updatePropertyDto,
      user.userId,
    );

    return {
      data,
      message: 'Property updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete property' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const property = await this.propertyService.findOne(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId?.toString() !== user.userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this property',
      );
    }

    await this.propertyService.remove(id);

    return {
      data: null,
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
      data,
      message: 'Property bookmarked successfully',
    };
  }

  @Delete(':id/bookmark')
  @ApiOperation({ summary: 'Remove bookmark' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Bookmark removed successfully' })
  async removeBookmark(@Param('id') id: string, @CurrentUser() user: any) {
    const data = await this.propertyService.removeBookmark(user.userId, id);

    return {
      data,
      message: 'Bookmark removed successfully',
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
      data,
      message: 'Bookmarked properties retrieved successfully',
    };
  }

  @Get('top-locations')
  @ApiOperation({ summary: 'Get top property locations' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Top locations retrieved' })
  async getTopLocations(@Query('limit') limit: number = 10) {
    const data = await this.propertyService.getTopLocations(limit);

    return {
      data,
      message: 'Top locations retrieved successfully',
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
      data,
      message: 'Nearby properties retrieved successfully',
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
      data,
      message: 'Recommendations retrieved successfully',
    };
  }
}

// ==================== BUILDER PROPERTY CONTROLLER ====================
@ApiTags('Builder')
@ApiBearerAuth()
@Controller('builder/properties')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.BUILDER)
export class BuilderPropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  @ApiOperation({
    summary: "Get builder's properties",
    description:
      'Retrieve all properties owned by the authenticated builder with advanced filtering, sorting, and pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: Status,
    description: 'Filter by property status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by property title or location',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'createdAt', 'views'],
    description: 'Field to sort by (default: createdAt)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (default: desc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully with pagination',
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
      data,
      message: 'Properties retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create new property',
    description:
      'Builder creates a new property listing with complete details including amenities, pricing, and media',
  })
  @ApiResponse({
    status: 201,
    description: 'Property created successfully with active status',
  })
  @ApiResponse({ status: 400, description: 'Invalid property data' })
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.propertyService.createBuilderProperty(
      createPropertyDto,
      user.userId,
    );

    return {
      data,
      message: 'Property created successfully',
    };
  }
}

// ==================== ADMIN PROPERTY CONTROLLER ====================
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/properties')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPropertyController {
  constructor(private readonly propertyService: PropertyService) {}

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
      data,
      message: 'Pending properties retrieved successfully',
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get approval statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    const data = await this.propertyService.getApprovalStats();
    return {
      data,
      message: 'Statistics retrieved successfully',
    };
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve property' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property approved successfully' })
  async approve(@Param('id') id: string, @CurrentUser() user: any) {
    const data = await this.propertyService.approveProperty(id, user.userId);

    return {
      data,
      message: 'Property approved successfully',
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
      data,
      message: 'Property rejected successfully',
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
      data,
      message: 'All properties retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create property (admin)' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  async createProperty(
    @Body() createPropertyDto: any,
    @CurrentUser() user: any,
  ) {
    const data = await this.propertyService.createPropertyAsAdmin(
      createPropertyDto,
      user.userId,
    );

    return {
      data,
      message: 'Property created successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update property (admin)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  async updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: any,
    @CurrentUser() user: any,
  ) {
    const data = await this.propertyService.updatePropertyAsAdmin(
      id,
      updatePropertyDto,
      user.userId,
    );

    return {
      data,
      message: 'Property updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete property (admin)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  async deleteProperty(@Param('id') id: string) {
    await this.propertyService.deletePropertyAsAdmin(id);

    return {
      data: null,
      message: 'Property deleted successfully',
    };
  }
}

// ==================== PUBLIC PROPERTIES CONTROLLER ====================
@ApiTags('Public Properties')
@Controller('public/properties')
export class PublicPropertiesController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  @ApiOperation({ summary: 'Browse all approved properties' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'city', required: false, example: 'Bangalore' })
  @ApiQuery({ name: 'state', required: false, example: 'Karnataka' })
  @ApiQuery({ name: 'propertyType', required: false })
  @ApiQuery({ name: 'propertyPurpose', required: false })
  @ApiQuery({ name: 'minPrice', required: false, example: 1000000 })
  @ApiQuery({ name: 'maxPrice', required: false, example: 10000000 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
  })
  async findAll(@Query() filters: any) {
    const data = await this.propertyService.findAllApproved(filters);
    return {
      data,
      message: 'Properties retrieved successfully',
    };
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured properties' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Featured properties retrieved' })
  async getFeatured(@Query('limit') limit?: number) {
    const data = await this.propertyService.getFeatured(limit);
    return {
      data,
      message: 'Featured properties retrieved successfully',
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search properties by text' })
  @ApiQuery({ name: 'q', required: true, example: 'luxury apartment' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(@Query('q') query: string, @Query() filters: any) {
    const data = await this.propertyService.search(query, filters);
    return {
      data,
      message: 'Search results retrieved successfully',
    };
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get properties near a location' })
  @ApiQuery({ name: 'latitude', required: true, example: 12.9716 })
  @ApiQuery({ name: 'longitude', required: true, example: 77.5946 })
  @ApiQuery({
    name: 'radius',
    required: false,
    example: 5,
    description: 'Radius in km',
  })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Nearby properties retrieved' })
  async getNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
    @Query('limit') limit?: number,
  ) {
    const data = await this.propertyService.getNearby(
      Number(latitude),
      Number(longitude),
      radius ? Number(radius) : 5,
      limit ? Number(limit) : 10,
    );
    return {
      data,
      message: 'Nearby properties retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property details by ID' })
  @ApiResponse({ status: 200, description: 'Property details' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.propertyService.findOneApproved(id);
    return {
      data,
      message: 'Property details retrieved successfully',
    };
  }
}
