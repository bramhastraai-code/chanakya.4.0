// broker-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { VerificationStatus } from '../enum/usertype.enum';
import { IsOptional } from 'class-validator';

export class BrokerResponseDto {
  @ApiProperty({ description: 'User ID' })
  @IsOptional()
  _id?: string;

  @ApiProperty({ description: 'User name' })
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'User profile image URL' })
  @IsOptional()
  userImage?: string;

  @ApiProperty({ description: 'User email', required: false })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Average response time', default: '1 day' })
  @IsOptional()
  responseTime?: string;

  @ApiProperty({ description: 'Service areas', type: [String], default: [] })
  @IsOptional()
  serviceAreas?: string[];

  @ApiProperty({
    enum: Object.values(VerificationStatus),
    description: 'Verification status',
    default: VerificationStatus.PENDING,
  })
  @IsOptional()
  verificationStatus?: VerificationStatus;

  @ApiProperty({
    description: 'Verification documents',
    type: [String],
    required: false,
  })
  @IsOptional()
  verificationDocuments?: string[];

  @ApiProperty({ description: 'License number', required: false })
  @IsOptional()
  licenseNumber?: string;

  @ApiProperty({ description: 'License expiry date', required: false })
  @IsOptional()
  licenseExpiry?: Date;

  @ApiProperty({ description: 'Years of experience', required: false })
  @IsOptional()
  yearsOfExperience?: number;

  @ApiProperty({ description: 'Agency name', required: false })
  @IsOptional()
  agencyName?: string;

  @ApiProperty({ description: 'Agency license', required: false })
  @IsOptional()
  agencyLicense?: string;

  @ApiProperty({ description: 'Year agency was founded', required: false })
  @IsOptional()
  agencyFoundedYear?: number;

  @ApiProperty({ description: 'Team size', default: 0 })
  @IsOptional()
  teamSize?: number;

  @ApiProperty({ description: 'Average rating (0-5)', default: 0 })
  @IsOptional()
  rating?: number;

  @ApiProperty({ description: 'Number of reviews received', default: 0 })
  @IsOptional()
  reviewCount?: number;

  @ApiProperty({ description: 'Number of closed deals', default: 0 })
  @IsOptional()
  closedDeals?: number;

  @ApiProperty({
    description: 'Calculated performance score (higher is better)',
    example: 4.25,
  })
  @IsOptional()
  performanceScore?: number;
}
