import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({ example: 'order_abc123' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: 'pay_xyz789' })
  @IsString()
  paymentId: string;

  @ApiProperty({ example: 'signature_generated_by_razorpay' })
  @IsString()
  signature: string;
}
