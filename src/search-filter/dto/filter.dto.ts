import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { EntityType } from '../enum/search.enum';
import {
  BHKConfiguration,
  PropertyType,
} from 'src/property/enum/property.enum';

export class PropertyFilterDto {
  @ApiPropertyOptional({
    description: 'Search query for title, description, and location',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Current page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Limit per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Type of entity to search for',
    enum: EntityType,
  })
  @IsOptional()
  @IsEnum(EntityType)
  type: EntityType = EntityType.PROPERTY;
}

export class PropertyFilter_V2_Dto {
  @ApiPropertyOptional({
    description: 'Search query for title, description, and location',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Current page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Limit per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Type of entity to search for',
    enum: EntityType,
  })
  @IsOptional()
  @IsEnum(EntityType)
  type: EntityType = EntityType.PROPERTY;

  @ApiPropertyOptional({ description: 'Minimum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Minimum area filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minArea?: number;

  @ApiPropertyOptional({ description: 'Maximum area filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxArea?: number;

  @ApiPropertyOptional({
    description: 'Sort options (priceAsc, priceDesc, areaAsc, areaDesc)',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Filter by property type (e.g., Residential, Commercial)',
    type: PropertyType,
    enum: PropertyType,
  })
  @IsOptional()
  @IsString()
  propertyType?: PropertyType;

  @ApiPropertyOptional({
    description: 'Filter by property configurations (e.g., 1BHK, 2BHK)',
    type: [BHKConfiguration], // Allowing an array of BHK configurations
    enum: BHKConfiguration,
  })
  @IsOptional()
  @IsEnum(BHKConfiguration, { each: true }) // Ensures each value in the array is valid
  propertyConfig?: BHKConfiguration[]; // Array of BHK configurations
}
