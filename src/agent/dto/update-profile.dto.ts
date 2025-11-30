import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
  IsUrl,
  IsArray,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Arpan Dangla' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'arpan@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ enum: ['Male', 'Female', 'Other'] })
  @IsEnum(['Male', 'Female', 'Other'])
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: '1990-01-15' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'Mumbai, Maharashtra' })
  @IsString()
  @IsOptional()
  location?: string;
}

export class UpdateSocialLinksDto {
  @ApiPropertyOptional({ example: 'https://facebook.com/arpandangla' })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/arpandangla' })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/arpandangla' })
  @IsUrl()
  @IsOptional()
  twitter?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/arpandangla' })
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/@arpandangla' })
  @IsUrl()
  @IsOptional()
  youtube?: string;
}

export class UpdateWebsiteDto {
  @ApiProperty({ example: 'https://arpanbdotos.com/' })
  @IsUrl()
  websiteUrl: string;
}

export class UpdateBusinessInfoDto {
  @ApiPropertyOptional({ example: 'MAH/RERA/12345/2023' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  yearsOfExperience?: number;

  @ApiPropertyOptional({ example: 'Real Estate Solutions' })
  @IsString()
  @IsOptional()
  agencyName?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  teamSize?: number;

  @ApiPropertyOptional({ example: ['Residential', 'Commercial', 'Luxury'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specializations?: string[];

  @ApiPropertyOptional({ example: ['Mumbai', 'Navi Mumbai', 'Thane'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceAreas?: string[];
}
