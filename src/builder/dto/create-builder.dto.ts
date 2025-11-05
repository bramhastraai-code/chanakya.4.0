import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBuilderDto {
  @ApiProperty({
    description: 'The name of the builder',
    example: 'John Doe Constructions',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the builder',
    example: 'John Doe Constructions description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The phone number of the builder',
    example: '+1234567890',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The email address of the builder',
    example: 'builder@example.com',
  })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiPropertyOptional({
    description: 'The alternate phone number of the builder',
    example: '+0987654321',
  })
  @IsOptional()
  alternatePhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pinCode?: string;

  @ApiPropertyOptional({
    description: 'The logo URL of the builder',
    example: 'http://example.com/logo.png',
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({
    description: 'List of inquiry IDs associated with the builder',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @Type(() => String)
  @IsMongoId({ each: true })
  inquiries?: string[];

  @ApiPropertyOptional({
    description: 'The owner of the builder (Customer ID)',
    type: String,
    example: '60f7f5f6c8d3c7f1b0f1d1b4',
  })
  @IsOptional()
  @IsMongoId()
  owner?: string;

  @ApiPropertyOptional({
    description: 'The user ID who created the builder',
    example: '60f7f5f6c8d3c7f1b0f1d1b2',
  })
  @IsOptional()
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'The user ID who last updated the builder',
    example: '60f7f5f6c8d3c7f1b0f1d1b3',
  })
  @IsOptional()
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Number of views for the builder',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  views?: number;

  @ApiPropertyOptional({
    description: ' builder from the date ',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  since?: number;

  @ApiProperty({
    description: 'status',
    example: 'active',
  })
  @IsOptional()
  status: string;
}
