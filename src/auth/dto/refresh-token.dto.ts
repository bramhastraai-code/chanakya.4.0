import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'User password',
    example: 'I',
  })
  @IsMongoId()
  userId: Types.ObjectId;
  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  refreshToken: string;
}
