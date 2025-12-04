import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  IsBoolean,
} from 'class-validator';
import { TransactionType } from '../enum/requirement.enum';

export class CreateRequirementDto {
  @ApiProperty({
    description: 'Title/summary of the property requirement',
    example: '3BHK Apartment in Whitefield',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Type of property required (apartment, villa, plot, etc.)',
    example: 'apartment',
  })
  @IsString()
  propertyType: string;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.BUYING,
  })
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiPropertyOptional({
    description: 'Property configuration (e.g., 2BHK, 3BHK, 4BHK)',
    example: '3 BHK',
  })
  @IsString()
  @IsOptional()
  configuration?: string;

  @ApiPropertyOptional({
    description: 'Minimum budget in INR',
    example: 9000000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum budget in INR',
    example: 10000000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMax?: number;

  @ApiPropertyOptional({
    description: 'Desired carpet area',
    example: '2900 sqft',
  })
  @IsString()
  @IsOptional()
  area?: string;

  @ApiProperty({
    description: 'Preferred location/area',
    example: 'Whitefield, Bangalore',
  })
  @IsString()
  location: string;

  @ApiPropertyOptional({
    description: 'Additional details and specific requirements',
    example:
      'Looking for a spacious 3 BHK apartment in prime location with good schools nearby and park view',
  })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({
    description:
      'Whether this requirement is visible to all agents (public) or only associated ones',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
