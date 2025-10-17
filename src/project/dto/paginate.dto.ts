import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateDto {
  @ApiProperty({
    description: 'Page number for pagination',
    default: 1,
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiProperty({
    description: 'Number of items per page for pagination',
    default: 10,
    example: 10,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number;
}

export class SearchQueryDto {
  @ApiProperty({
    description: 'Search query string to filter projects',
    example: 'luxury apartments',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
