import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsObject, IsEnum } from 'class-validator';
import { OrderStatus } from '../enum/order.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New status of the order',
    example: 'success',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus, {
    message: 'Status must be one of pending, success, or failed',
  })
  @IsNotEmpty()
  status: OrderStatus;

  @ApiProperty({
    description: 'Details of the payment made for the order',
    example: { paymentId: 'pay_xyz123', signature: 'abc123' },
  })
  @IsObject()
  @IsOptional()
  paymentDetails?: Record<string, any>;
}
