import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsUrl,
  Min,
} from 'class-validator';

export class UpdateAgentProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Prime Realty' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({ example: 'Senior Agent' })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  experienceYears?: number;

  @ApiPropertyOptional({ example: ['English', 'Hindi', 'Marathi'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiPropertyOptional({ example: 'Experienced real estate agent...' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'MAH/RERA/12345/2023' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: ['Residential', 'Commercial', 'Luxury'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialization?: string[];

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: ['Mumbai', 'Navi Mumbai', 'Thane'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceAreas?: string[];
}

export class UpdateSocialLinksDto {
  @ApiPropertyOptional({ example: 'https://facebook.com/johndoe' })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/johndoe' })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/johndoe' })
  @IsUrl()
  @IsOptional()
  twitter?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/johndoe' })
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/@johndoe' })
  @IsUrl()
  @IsOptional()
  youtube?: string;
}

export class UpdateWebsiteDto {
  @ApiProperty({ example: 'https://johndoe-realty.com' })
  @IsUrl()
  websiteUrl: string;
}
