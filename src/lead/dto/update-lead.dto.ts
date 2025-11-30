import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { LeadStatus } from '../enum/lead-status.enum';

export class UpdateLeadDto {
  @ApiPropertyOptional({ enum: LeadStatus })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({ example: 'User visited site and is interested' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: '2025-11-25T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  lastContactedAt?: string;
}
