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
} from 'class-validator';
import { BountyType, BountyStatus } from '../../enum/bounty.enum';

export class CreateBountyDto {
  @ApiProperty({ example: 'Refer a User - Earn ₹500' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Refer a friend looking to buy property and earn rewards.',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  rewardAmount: number;

  @ApiProperty({ enum: BountyType, example: BountyType.LEAD_REFERRAL })
  @IsEnum(BountyType)
  type: BountyType;

  @ApiPropertyOptional({
    example: ['Lead must be valid', 'Lead must visit site'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;
}

export class UpdateBountyDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  rewardAmount?: number;

  @ApiPropertyOptional({ enum: BountyStatus })
  @IsEnum(BountyStatus)
  @IsOptional()
  status?: BountyStatus;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;
}

export class SubmitBountyDto {
  @ApiProperty({ example: 'bounty_id' })
  @IsString()
  bountyId: string;

  @ApiProperty({
    example: {
      name: 'John Doe',
      phone: '+919876543210',
      notes: 'Interested in 3BHK',
    },
  })
  @IsObject()
  submissionData: Record<string, any>;
}

export class ReviewSubmissionDto {
  @ApiProperty({ example: true })
  approved: boolean;

  @ApiPropertyOptional({ example: 'Valid lead, verified.' })
  @IsString()
  @IsOptional()
  feedback?: string;
}
