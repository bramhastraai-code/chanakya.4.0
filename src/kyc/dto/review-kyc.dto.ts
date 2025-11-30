import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ReviewKycDto {
  @ApiPropertyOptional({ example: 'Document quality is poor' })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
