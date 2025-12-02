import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
  IsArray,
  IsUrl,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsPhoneNumber('IN')
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'City, State' })
  @IsString()
  @IsOptional()
  location?: string;
}

export class UpdateSocialLinksDto {
  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  twitter?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  youtube?: string;
}

export class UpdateWebsiteDto {
  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;
}

export class UpdateBusinessInfoDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  yearsOfExperience?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  agencyName?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  teamSize?: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specializations?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceAreas?: string[];
}
