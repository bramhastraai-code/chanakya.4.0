import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsMongoId,
  Min,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLeadDto {
  @ApiProperty({
    description: 'Full name of the customer/lead',
    example: 'Rajesh Kumar',
  })
  @IsString()
  customerName: string;

  @ApiProperty({
    description: 'Customer phone number with country code',
    example: '+919876543210',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  customerPhone: string;

  @ApiPropertyOptional({
    description: 'Customer email address',
    example: 'rajesh.kumar@example.com',
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiProperty({
    description: 'Property ID the lead is interested in',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  propertyId: string;

  @ApiPropertyOptional({
    description: 'Minimum budget in INR',
    example: 5000000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum budget in INR',
    example: 7500000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMax?: number;

  @ApiPropertyOptional({
    description: 'Preferred location/locality',
    example: 'Whitefield, Bangalore',
  })
  @IsString()
  @IsOptional()
  preferredLocation?: string;

  @ApiPropertyOptional({
    description: 'Specific requirements from the customer',
    example: 'Looking for 3BHK near good schools and metro station',
  })
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the lead',
    example:
      'Interested customer from website inquiry, ready to visit this weekend',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Agent ID to assign this lead to (Admin/Builder only)',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  @IsOptional()
  assignedTo?: string;
}
