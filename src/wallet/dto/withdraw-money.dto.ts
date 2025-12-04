import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsObject,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class BankAccountDto {
  @ApiProperty({ example: '1234567890' })
  @IsString()
  accountNumber: string;

  @ApiProperty({ example: 'SBIN0001234' })
  @IsString()
  ifscCode: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  accountHolderName: string;
}

export class WithdrawMoneyDto {
  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ type: BankAccountDto })
  @IsObject()
  @ValidateNested()
  @Type(() => BankAccountDto)
  bankAccount: BankAccountDto;
}
