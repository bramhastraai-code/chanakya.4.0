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
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
// import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service'; // Import your S3 service
import { Response } from 'src/common/interceptor/response.interface';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertySummaryDto } from './dto/recommondedProperty.dto';
import { PropertyDetailDto } from './dto/property-detail.dto';
import { Status } from 'src/common/enum/status.enum';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly s3Service: S3Service, // Inject the S3 service
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
      // Set user-related fields from JWT token
      createPropertyDto.createdBy = user.userId;
      createPropertyDto.updatedBy = user.userId;
      createPropertyDto.ownerId = user.userId; // Owner is the user creating the property

      // Set builderId if user is a BUILDER or AGENT
      if (user.role === UserRole.BUILDER || user.role === UserRole.AGENT) {
        createPropertyDto.builderId = user.userId;
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
      // Set updatedBy from authenticated user
      updatePropertyDto.updatedBy = user.userId;

      const data = await this.propertyService.update(id, updatePropertyDto);
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
      console.error('Error fetching formatted properties:', error);
      return error;
    }
  }

  @Post('create-web')
  @ApiOperation({ summary: 'Create a new property' })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({
    status: 201,
    description: 'Property created successfully',
    type: Property,
  })
  @UseGuards(jwtGuard, RolesGuard)
  @Roles(UserRole.BUILDER, UserRole.ADMIN, UserRole.AGENT)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createWeb(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: any,
  ): Promise<{ data: Property; message: string }> {
    try {
      // Set user-related fields from JWT token
      createPropertyDto.createdBy = user.userId;
      createPropertyDto.updatedBy = user.userId;
      createPropertyDto.ownerId = user.userId; // Owner is the user creating the property

      // Set builderId if user is a BUILDER or AGENT
      if (user.role === UserRole.BUILDER || user.role === UserRole.AGENT) {
        createPropertyDto.builderId = user.userId;
      }

      const data = await this.propertyService.createWeb(createPropertyDto);
      return { data, message: 'Property created successfully' };
    } catch (error) {
      throw error;
    }
  }
}
