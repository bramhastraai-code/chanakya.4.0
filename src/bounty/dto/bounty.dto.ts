import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
  IsObject,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BountyType, BountyStatus } from '../enum/bounty.enum';

export class CreateBountyDto {
  @ApiProperty({
    description: 'Title of the bounty program',
    example: 'Refer a User - Earn ₹500',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the bounty program and how to earn',
    example:
      'Refer a friend looking to buy property and earn rewards. Lead must visit site and show genuine interest.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Reward amount in INR',
    example: 500,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  rewardAmount: number;

  @ApiProperty({
    description: 'Type of bounty program',
    enum: BountyType,
    example: BountyType.LEAD_REFERRAL,
  })
  @IsEnum(BountyType)
  type: BountyType;

  @ApiPropertyOptional({
    description: 'List of requirements/conditions to fulfill the bounty',
    example: [
      'Lead must be valid',
      'Lead must visit site',
      'Lead should show genuine interest',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @ApiPropertyOptional({
    description:
      'Expiry date and time of the bounty program in ISO 8601 format',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiryDate?: Date;

  @ApiProperty({
    description: 'Project ID this bounty is associated with',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  projectId: string;
}

export class UpdateBountyDto {
  @ApiPropertyOptional({
    description: 'Updated title of the bounty program',
    example: 'Refer a User - Earn ₹1000',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated description',
    example: 'Updated reward structure for referrals',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated reward amount in INR',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  rewardAmount?: number;

  @ApiPropertyOptional({
    description: 'Update bounty status',
    enum: BountyStatus,
    example: BountyStatus.ACTIVE,
  })
  @IsEnum(BountyStatus)
  @IsOptional()
  status?: BountyStatus;

  @ApiPropertyOptional({
    description: 'Updated requirements list',
    example: ['Lead must be verified', 'Lead must complete site visit'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @ApiPropertyOptional({
    description: 'Updated expiry date in ISO 8601 format',
    example: '2026-06-30T23:59:59.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiryDate?: Date;
}

export class SubmitBountyDto {
  @ApiProperty({
    description: 'Bounty program ID to submit for',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  bountyId: string;

  @ApiProperty({
    description:
      'Submission data containing required information (lead details, proof, etc.)',
    example: {
      name: 'John Doe',
      phone: '+919876543210',
      email: 'john@example.com',
      notes: 'Interested in 3BHK apartments, budget 50-60 lakhs',
      visitDate: '2025-12-10',
    },
  })
  @IsObject()
  submissionData: Record<string, any>;
}

export class ReviewSubmissionDto {
  @ApiProperty({
    description: 'Whether to approve or reject the submission',
    example: true,
  })
  @IsBoolean()
  approved: boolean;

  @ApiPropertyOptional({
    description: 'Feedback or reason for approval/rejection',
    example: 'Valid lead, verified and scheduled for site visit.',
  })
  @IsString()
  @IsOptional()
  feedback?: string;
}
