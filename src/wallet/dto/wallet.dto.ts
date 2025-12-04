import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  IsObject,
} from 'class-validator';
import { TransactionType } from '../enum/transaction.enum';

export class CreditDebitDto {
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Bonus for excellent performance' })
  @IsString()
  description: string;

  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.ADJUSTMENT,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({ example: { reason: 'manual_adjustment' } })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class WalletStatsDto {
  @ApiProperty()
  balance: number;

  @ApiProperty()
  pendingEarnings: number;

  @ApiProperty()
  lifetimeEarnings: number;
}
