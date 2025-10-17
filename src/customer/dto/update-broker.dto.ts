// update-broker.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateBrokerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  responseTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceAreas?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  licenseExpiry?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  agencyName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  agencyLicense?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  agencyFoundedYear?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  teamSize?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pinCode?: string;
}