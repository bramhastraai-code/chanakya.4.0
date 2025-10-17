import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    format: 'binary', // Specify the format for file upload in Swagger
    required: false,
    description: 'User profile image',
  })
  @IsOptional()
  userImage?: any; // Since this will be a file, don't validate as string

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contactNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  pinCode?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  role?: Types.ObjectId;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  createdBy?: Types.ObjectId;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  updatedBy?: Types.ObjectId;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
