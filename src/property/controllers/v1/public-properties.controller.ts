import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PropertyV1Service } from '../../services/property-v1.service';
import {
  PropertyType,
  PropertyPurpose,
  BHKConfiguration,
} from '../../enum/property.enum';

@ApiTags('Public Properties')
@Controller('public/properties')
export class PublicPropertiesController {
  constructor(private readonly propertyService: PropertyV1Service) {}

  @Get()
  @ApiOperation({ summary: 'Browse all approved properties' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'city', required: false, example: 'Bangalore' })
  @ApiQuery({ name: 'state', required: false, example: 'Karnataka' })
  @ApiQuery({ name: 'propertyType', enum: PropertyType, required: false })
  @ApiQuery({ name: 'propertyPurpose', enum: PropertyPurpose, required: false })
  @ApiQuery({
    name: 'bhkConfiguration',
    enum: BHKConfiguration,
    required: false,
  })
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
      success: true,
      data,
    };
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured properties' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Featured properties retrieved' })
  async getFeatured(@Query('limit') limit?: number) {
    const data = await this.propertyService.getFeatured(limit);
    return {
      success: true,
      data,
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
      success: true,
      data,
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
      success: true,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property details by ID' })
  @ApiResponse({ status: 200, description: 'Property details' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.propertyService.findOneApproved(id);
    return {
      success: true,
      data,
    };
  }
}
