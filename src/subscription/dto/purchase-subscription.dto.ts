import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { SubscriptionPlanType } from '../enum/subscription.enum';

export class PurchaseSubscriptionDto {
  @ApiProperty({ enum: SubscriptionPlanType, example: 'pro' })
  @IsEnum(SubscriptionPlanType)
  planType: SubscriptionPlanType;

  @ApiProperty({ example: 'upi', description: 'Payment method' })
  paymentMethod: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  autoRenew?: boolean;
}
