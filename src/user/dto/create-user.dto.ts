import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => value?.toLowerCase().trim())
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

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return null;
    if (value instanceof Types.ObjectId) return value.toString();
    if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
      return value; // Return as string for DTO, convert to ObjectId in service
    }
    return null;
  })
  @ApiProperty({ required: false, type: String })
  role?: string | null;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return null;
    if (value instanceof Types.ObjectId) return value.toString();
    if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
      return value;
    }
    return null;
  })
  @ApiProperty({ required: false, type: String })
  createdBy?: string | null;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return null;
    if (value instanceof Types.ObjectId) return value.toString();
    if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
      return value;
    }
    return null;
  })
  @ApiProperty({ required: false, type: String })
  updatedBy?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
