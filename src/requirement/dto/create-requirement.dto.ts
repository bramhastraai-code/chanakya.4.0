import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { TransactionType } from '../enum/requirement.enum';

export class CreateRequirementDto {
  @ApiProperty({ example: '3BHK Apartment in Whitefield' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'apartment' })
  @IsString()
  propertyType: string;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiPropertyOptional({ example: '3 BHK' })
  @IsString()
  @IsOptional()
  configuration?: string;

  @ApiPropertyOptional({ example: 9000000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMin?: number;

  @ApiPropertyOptional({ example: 10000000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMax?: number;

  @ApiPropertyOptional({ example: '2900 sqft' })
  @IsString()
  @IsOptional()
  area?: string;

  @ApiProperty({ example: 'Whitefield, Bangalore' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: 'Looking for a spacious 3 BHK apartment in prime location' })
  @IsString()
  @IsOptional()
  details?: string;
}
