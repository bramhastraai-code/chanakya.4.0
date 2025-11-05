import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateAgentInquiryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail()
  email?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  YearOfExperience?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pinCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  status?: string;
}
