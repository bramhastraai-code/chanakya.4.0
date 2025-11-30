import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({ example: 'What is RERA kya hota hai?' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
