import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  Matches,
  IsNumber,
  IsBoolean,
  IsUrl,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAgentDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'agent@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+919876543211' })
  @Transform(({ value }) => value?.trim())
  @IsPhoneNumber('IN')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'SecurePass@123', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number',
  })
  password: string;

  // Profile fields
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
  @IsOptional()
  experienceYears?: number;

  @ApiPropertyOptional({ example: ['English', 'Hindi'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiPropertyOptional({ example: 'Experienced agent...' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'LIC123456' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: ['Residential', 'Commercial'] })
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

  @ApiPropertyOptional({ example: ['Andheri', 'Bandra'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceAreas?: string[];

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;
}
