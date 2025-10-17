import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSearchFilterDto {
  @ApiProperty({
    description: 'Filter for the search, such as term or category.',
    example: 'real estate',
  })
  @IsString()
  @IsNotEmpty()
  filter: string;
}

export class CreateSearchDto {
  @ApiProperty({
    description: 'The unique identifier for the user.',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The search term that the user entered.',
    example: 'apartment for rent',
  })
  @IsString()
  @IsNotEmpty()
  term: string;
}

export class PaginationDto {
  @ApiProperty({
    description: 'The page number for pagination',
    default: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1, { message: 'Page must be a positive integer starting from 1' })
  @Transform(({ value }) => Number(value), { toClassOnly: true }) // Ensure transformation to number
  page: number;

  @ApiProperty({
    description: 'The limit of items per page for pagination',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1, { message: 'Limit must be a positive integer greater than 0' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 10), { toClassOnly: true }) // Transform limit to number and default to 10
  limit: number;
}
