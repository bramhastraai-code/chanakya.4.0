import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateAuthDto {
  @ApiProperty({
    description: 'Email (Email)',
  })
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
