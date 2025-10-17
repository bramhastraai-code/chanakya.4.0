import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  UserStatus,
  UserType,
  VerificationStatus,
} from '../enum/usertype.enum';

export class CreateBuilderDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fcmToken?: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty({ enum: UserType, default: UserType.BUILDER })
  @IsEnum(UserType)
  userType: UserType = UserType.BUILDER;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ required: false, default: '1 day' })
  @IsOptional()
  @IsString()
  responseTime?: string = '1 day';

  @ApiProperty({ type: [String], required: false, default: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceAreas?: string[] = [];

  @ApiPropertyOptional({
    description: 'Array of builder IDs associated with the customer',
    type: [String],
    example: ['60d21b4667d0d8992e610c85', '60d21b4967d0d8992e610c86'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  builders?: string[];

  @ApiProperty({
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  @IsEnum(VerificationStatus)
  verificationStatus: VerificationStatus = VerificationStatus.PENDING;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  verificationDocuments?: string[];

  @ApiProperty({ enum: UserStatus, default: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.ACTIVE;

  @ApiProperty()
  @IsString()
  latitude: string;

  @ApiProperty()
  @IsString()
  longitude: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  pinCode: string;
}

export class UpdateBuilderDto extends PartialType(CreateBuilderDto) {}
