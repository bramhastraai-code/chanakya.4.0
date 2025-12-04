import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsMongoId,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLeadDto {
  @ApiProperty({ example: 'Rajesh Kumar' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: '+919876543210' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  customerPhone: string;

  @ApiPropertyOptional({ example: 'rajesh@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  propertyId: string;

  @ApiPropertyOptional({ example: 5000000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMin?: number;

  @ApiPropertyOptional({ example: 7500000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMax?: number;

  @ApiPropertyOptional({ example: 'Whitefield, Bangalore' })
  @IsString()
  @IsOptional()
  preferredLocation?: string;

  @ApiPropertyOptional({ example: 'Looking for 3BHK near good schools' })
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiPropertyOptional({ example: 'Interested customer from website' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Agent ID to assign (Admin only)' })
  @IsMongoId()
  @IsOptional()
  assignedTo?: string;
}
