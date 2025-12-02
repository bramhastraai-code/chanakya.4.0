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
} from 'class-validator';

export class CreateBuilderDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'builder@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+919876543210' })
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
  @ApiProperty({ example: 'ABC Constructions' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsOptional()
  companyLogo?: string;

  @ApiPropertyOptional({ example: 2010 })
  @IsNumber()
  @IsOptional()
  establishedYear?: number;

  @ApiPropertyOptional({ example: 'RERA123456' })
  @IsString()
  @IsOptional()
  reraNumber?: string;

  @ApiPropertyOptional({ example: 'GSTIN123456' })
  @IsString()
  @IsOptional()
  gstin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @ApiPropertyOptional({ example: 'contact@abc.com' })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+919876543211' })
  @IsPhoneNumber('IN')
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'Leading builder in the city' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://abc.com' })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;
}
