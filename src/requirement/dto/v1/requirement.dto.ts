import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
} from 'class-validator';
import {
  RequirementStatus,
  TransactionType,
} from '../../enum/requirement.enum';

export class CreateRequirementDto {
  @ApiProperty({ example: 'Looking for 3BHK in Whitefield' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'apartment' })
  @IsString()
  propertyType: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.BUYING })
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiPropertyOptional({ example: '3BHK' })
  @IsString()
  @IsOptional()
  configuration?: string;

  @ApiPropertyOptional({ example: 8000000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMin?: number;

  @ApiPropertyOptional({ example: 12000000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMax?: number;

  @ApiPropertyOptional({ example: '1500 sqft' })
  @IsString()
  @IsOptional()
  area?: string;

  @ApiProperty({ example: 'Whitefield, Bangalore' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: ['Gym', 'Pool'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsDateString()
  @IsOptional()
  possessionDate?: Date;

  @ApiPropertyOptional({ example: 'Prefer upper floors, east facing' })
  @IsString()
  @IsOptional()
  details?: string;
}

export class UpdateRequirementDto {
  @ApiPropertyOptional({ example: 'Looking for 3BHK in Whitefield' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'apartment' })
  @IsString()
  @IsOptional()
  propertyType?: string;

  @ApiPropertyOptional({ enum: TransactionType })
  @IsEnum(TransactionType)
  @IsOptional()
  transactionType?: TransactionType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  configuration?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMin?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMax?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  area?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  possessionDate?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({ enum: RequirementStatus })
  @IsEnum(RequirementStatus)
  @IsOptional()
  status?: RequirementStatus;
}
