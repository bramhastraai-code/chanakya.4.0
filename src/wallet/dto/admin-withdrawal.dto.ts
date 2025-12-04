import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class AdminWithdrawalApprovalDto {
  @ApiProperty({ enum: WithdrawalStatus, example: WithdrawalStatus.APPROVED })
  @IsEnum(WithdrawalStatus)
  status: WithdrawalStatus;

  @ApiPropertyOptional({ example: 'Approved by admin' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ example: 'razorpay_payout_123' })
  @IsString()
  @IsOptional()
  payoutId?: string;
}
