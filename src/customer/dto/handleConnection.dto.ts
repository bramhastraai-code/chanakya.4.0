import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BrokerConnectionRequestDto {
  @ApiProperty({
    description: 'The unique identifier of the broker',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  brokerId: string;
}

export class HandleBrokerConnectionDto {
  @ApiProperty({
    description: 'The name of the broker',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  brokerName: string;

  @ApiProperty({
    description: 'The action to perform on the broker connection',
    enum: ['accept', 'reject'],
    example: 'accept',
  })
  @IsNotEmpty()
  @IsEnum(['accept', 'reject'], {
    message: 'Action must be either "accept" or "reject"',
  })
  action: 'accept' | 'reject';
}
