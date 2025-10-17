// src/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the user placing the order',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID of the plan for the  order',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({
    description: 'Order amount in INR',
    example: 500,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
