import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  Min,
  IsDate,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OfferType } from '../enum/offer.enum';

export class CreateOfferDto {
  @ApiProperty({
    description: 'Title of the offer/incentive program',
    example: '10% Commission Boost on Early Sales',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the offer terms and conditions',
    example:
      'Get 10% extra commission on all sales closed in the first month. Applicable for first 10 units only.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Incentive amount in INR',
    example: 50000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  incentiveAmount: number;

  @ApiProperty({
    description: 'Type of offer',
    enum: OfferType,
    example: OfferType.COMMISSION_BOOST,
  })
  @IsEnum(OfferType)
  type: OfferType;

  @ApiPropertyOptional({
    description: 'Terms and conditions for the offer',
    example: [
      'Valid for first 10 units only',
      'Payment within 30 days of booking',
      'Agent must be active',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  termsAndConditions?: string[];

  @ApiPropertyOptional({
    description: 'Minimum number of units agent must sell to qualify',
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minUnitsToSell?: number;

  @ApiPropertyOptional({
    description: 'Additional commission percentage offered',
    example: 2.5,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPercentage?: number;

  @ApiPropertyOptional({
    description: 'Start date of offer validity in ISO 8601 format',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validFrom?: Date;

  @ApiPropertyOptional({
    description: 'End date of offer validity in ISO 8601 format',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validUntil?: Date;

  @ApiProperty({
    description: 'Project ID this offer is associated with',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  projectId: string;
}
