import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerAuthDto {
  @ApiProperty({
    description: 'User Contact Number',
    example: '9999999999',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: '+1234567890',
    description: 'The mobile number used to verify the OTP',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: '123456',
    description: 'The OTP sent to the mobile number',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6) // Assuming OTP length is fixed at 6 digits
  otp: string;
}
