import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsObject,
  Min,
  Max,
} from 'class-validator';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: 'John User' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: ['Whitefield, Bangalore', 'Koramangala, Bangalore'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredLocations?: string[];

  @ApiPropertyOptional({ example: { min: 5000000, max: 10000000 } })
  @IsObject()
  @IsOptional()
  budgetRange?: {
    min?: number;
    max?: number;
  };

  @ApiPropertyOptional({ example: ['apartment', 'villa'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interestedPropertyTypes?: string[];

  @ApiPropertyOptional({ example: 'Looking for 3BHK with good amenities' })
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiPropertyOptional({ example: 'Bangalore' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsString()
  @IsOptional()
  state?: string;
}
