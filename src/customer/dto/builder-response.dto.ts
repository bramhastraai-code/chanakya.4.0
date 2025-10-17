// src/builders/dto/builder-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  UserStatus,
  UserType,
  VerificationStatus,
} from '../enum/usertype.enum';

class SocialMediaResponseDto {
  @ApiProperty({ required: false })
  facebook?: string;

  @ApiProperty({ required: false })
  linkedin?: string;

  @ApiProperty({ required: false })
  instagram?: string;
}

export class BuilderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  userImage?: string;

  @ApiProperty({ required: false })
  fcmToken?: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserType })
  userType: UserType;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ required: false })
  responseTime?: string;

  @ApiProperty({ type: [String] })
  serviceAreas: string[];

  @ApiProperty({ enum: VerificationStatus })
  verificationStatus: VerificationStatus;

  @ApiProperty({ type: [String], required: false })
  verificationDocuments?: string[];

  @ApiProperty({ required: false })
  licenseNumber?: string;

  @ApiProperty({ required: false })
  licenseExpiry?: Date;

  @ApiProperty({ required: false })
  yearsOfExperience?: number;

  @ApiProperty({ required: false })
  agencyName?: string;

  @ApiProperty({ required: false })
  agencyLicense?: string;

  @ApiProperty({ required: false })
  agencyFoundedYear?: number;

  @ApiProperty()
  teamSize: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  reviewCount: number;

  @ApiProperty()
  closedDeals: number;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ required: false })
  socialMedia?: SocialMediaResponseDto;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longitude: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  pinCode: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
