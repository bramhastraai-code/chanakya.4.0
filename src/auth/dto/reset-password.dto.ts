import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminResetPasswordDto {
  @ApiProperty({
    description: 'The ID of the user whose password will be reset',
    type: String,
  })
  @IsString({ message: 'User ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'User ID cannot be empty' })
  userId: string;

  @ApiProperty({
    description: 'The new password to set for the user',
    type: String,
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password cannot be empty' })
  newPassword: string;
}
