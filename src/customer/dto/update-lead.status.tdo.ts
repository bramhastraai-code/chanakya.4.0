// update-lead-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LeadStatus } from '../enum/usertype.enum';

export class UpdateLeadStatusDto {
  @ApiProperty({
    enum: LeadStatus,
    example: LeadStatus.QUALIFIED,
    description: 'New status for the lead',
  })
  @IsEnum(LeadStatus)
  @IsNotEmpty()
  status: LeadStatus;

  @ApiProperty({
    required: false,
    description: 'Optional notes about the status change',
  })
  @IsString()
  notes?: string;
}
