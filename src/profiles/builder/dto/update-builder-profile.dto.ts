import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsUrl,
  IsObject,
  Min,
} from 'class-validator';

export class UpdateBuilderProfileDto {
  @ApiPropertyOptional({ example: 'ABC Constructions Pvt Ltd' })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({ example: 2010 })
  @IsNumber()
  @Min(1900)
  @IsOptional()
  establishedYear?: number;

  @ApiPropertyOptional({ example: 'MAH/RERA/67890/2020' })
  @IsString()
  @IsOptional()
  reraNumber?: string;

  @ApiPropertyOptional({ example: '27AABCU9603R1ZM' })
  @IsString()
  @IsOptional()
  gstin?: string;

  @ApiPropertyOptional({
    example: {
      street: '123 Builder St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
    },
  })
  @IsObject()
  @IsOptional()
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  @ApiPropertyOptional({ example: 'Rajesh Kumar' })
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @ApiPropertyOptional({ example: 'rajesh@abc-constructions.com' })
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({
    example: 'Leading real estate developer in Maharashtra...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: ['ISO 9001:2015', 'LEED Certified'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  certifications?: string[];
}

export class UpdateBuilderSocialLinksDto {
  @ApiPropertyOptional({ example: 'https://abc-constructions.com' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/abcconstructions' })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/abcconstructions' })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/company/abc-constructions',
  })
  @IsUrl()
  @IsOptional()
  linkedin?: string;
}
