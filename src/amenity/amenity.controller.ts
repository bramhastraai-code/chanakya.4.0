import {
  Body,
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AmenityService } from './amenity.service';
import { Amenity } from './entities/amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { Logger } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('amenities')
@Controller('amenity')
export class AmenityController {
  private readonly logger = new Logger(AmenityController.name);

  constructor(private readonly amenityService: AmenityService) {}

  @Post()
  @UseGuards(jwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new amenity (admin only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Amenity created successfully',
    type: Amenity,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - admin only',
  })
  async create(
    @Body() createAmenityDto: CreateAmenityDto,
  ): Promise<Response<Amenity>> {
    try {
      const data = await this.amenityService.create(createAmenityDto);
      this.logger.log(`Amenity created: ${data._id}`);
      return { data, message: 'amenities created' };
    } catch (error) {
      throw error;
    }
  }

  @Patch('amenity/:id')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing amenity (admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Amenity updated successfully',
    type: Amenity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Amenity not found',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - admin only',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAmenityDto: UpdateAmenityDto,
  ): Promise<Amenity> {
    try {
      const updatedAmenity = await this.amenityService.update(
        id,
        updateAmenityDto,
      );
      if (!updatedAmenity) {
        throw new NotFoundException('Amenity not found');
      }
      return updatedAmenity;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the amenity.',
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all amenities with pagination, sorting, and search',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: true,
    description: 'Number of amenities per page',
  })
  @ApiQuery({
    name: 'pageNumber',
    type: Number,
    required: true,
    description: 'Page number to retrieve',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    enum: ['name', 'createdAt', 'updatedAt'],
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'searchQuery',
    type: String,
    required: false,
    description: 'Search term for filtering amenities',
  })
  @ApiOkResponse({
    description: 'List of amenities retrieved successfully',
    type: [Amenity],
  })
  @ApiNotFoundResponse({
    description: 'No amenities found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchQuery') searchQuery?: string,
  ): Promise<
    Response<{
      amenities: Amenity[];
      totalPages: number;
      totalAmenities: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.amenityService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
      );

      if (!data.amenities || data.amenities.length === 0) {
        throw new NotFoundException('No amenities found');
      }

      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving amenities.',
      );
    }
  }

  @Get('amenity/:id')
  @ApiOperation({ summary: 'Retrieve a single amenity by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The amenity details',
    type: Amenity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Amenity not found',
  })
  async findOne(@Param('id') id: string): Promise<Response<Amenity>> {
    try {
      const amenity = await this.amenityService.findOne(id);
      if (!amenity) {
        throw new NotFoundException('Amenity not found');
      }
      return { data: amenity, message: 'retrieve successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the amenity.',
      );
    }
  }

  @Delete('amenity/:id')
  @ApiOperation({ summary: 'Delete an amenity by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Amenity deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Amenity not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const result = await this.amenityService.remove(id);
      if (result.deletedCount === 0) {
        throw new NotFoundException('Amenity not found');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the amenity.',
      );
    }
  }

  @Get('amenity-list')
  @ApiOperation({
    summary: 'Retrieve all amenities',
  })
  @ApiOkResponse({
    description: 'List of amenities retrieved successfully',
    type: [Amenity],
  })
  @ApiNotFoundResponse({
    description: 'No amenities found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async amenityList(): Promise<Response<{ value: unknown; label: string }[]>> {
    try {
      const data = await this.amenityService.AmenityList();

      if (!data || data.length === 0) {
        throw new NotFoundException('No amenities found');
      }

      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }
}
