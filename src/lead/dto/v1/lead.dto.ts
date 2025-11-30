import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsPhoneNumber,
  IsEmail,
  Min,
} from 'class-validator';
import { LeadStatus } from '../../enum/lead-status.enum';

export class CreateLeadDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: '+919876543210' })
  @IsPhoneNumber()
  customerPhone: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiProperty({ example: 'property_id' })
  @IsString()
  propertyId: string;

  @ApiPropertyOptional({ example: 4000000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMin?: number;

  @ApiPropertyOptional({ example: 6000000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMax?: number;

  @ApiPropertyOptional({ example: 'Whitefield, Bangalore' })
  @IsString()
  @IsOptional()
  preferredLocation?: string;

  @ApiPropertyOptional({ example: 'Looking for 2BHK near metro station' })
  @IsString()
  @IsOptional()
  requirements?: string;
}

export class UpdateLeadDto {
  @ApiPropertyOptional({ enum: LeadStatus })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({ example: 'User interested, scheduled site visit' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 4500000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMin?: number;

  @ApiPropertyOptional({ example: 5500000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMax?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  preferredLocation?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  requirements?: string;
}

export class AssignLeadDto {
  @ApiProperty({ example: 'agent_user_id' })
  @IsString()
  agentId: string;
}

export class AddActivityDto {
  @ApiProperty({
    enum: ['call', 'email', 'meeting', 'note', 'site_visit'],
    example: 'call',
  })
  @IsEnum(['call', 'email', 'meeting', 'note', 'site_visit'])
  type: string;

  @ApiProperty({ example: 'Called customer to discuss requirements' })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: { duration: '15 minutes', outcome: 'positive' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
