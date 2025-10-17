import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PropertyFilterDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'City to filter the properties by',
    example: 'New York',
  })
  city?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      'Search keyword to filter properties by title, description, or address',
    example: 'luxury apartment',
  })
  search?: string; // New search field for title, description, and address

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
    default: 10,
  })
  limit: number = 10;
}
