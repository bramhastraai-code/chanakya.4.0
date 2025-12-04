import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class AdminDepositDto {
  @ApiProperty({ example: 1000, description: 'Amount to deposit in INR' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Commission payment for property sale' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'property123' })
  @IsString()
  @IsOptional()
  propertyId?: string;

  @ApiPropertyOptional({ example: 'bounty456' })
  @IsString()
  @IsOptional()
  bountyId?: string;
}
