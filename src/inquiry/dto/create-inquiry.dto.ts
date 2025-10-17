import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
export class CreateInquiryDto {
  @ApiProperty({ description: 'Customer ID who made the inquiry' })
  @IsOptional()
  userId: string | Types.ObjectId; // Accept as string

  @ApiProperty({
    description: 'Contact number of the customer',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactNumber?: string;

  @ApiProperty({
    description: 'title of the customer',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Type of the inquiry',
    enum: ['common', 'groupBuy', 'agentSelection', 'quickBuy', 'siteVisit'],
    default: 'common',
    required: false,
  })
  @IsString()
  @IsOptional()
  inquiryType?:
    | 'common'
    | 'groupBuy'
    | 'agentSelection'
    | 'quickBuy'
    | 'siteVisit';

  @ApiProperty({
    description: 'Date of the site visit',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  siteVisitDate?: Date;

  @ApiProperty({
    description: 'Time of the site visit',
    required: false,
  })
  @IsString()
  @IsOptional()
  siteVisitTime?: string;

  @ApiProperty({
    description: 'Project ID related to the inquiry',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  projectId?: string;

  @ApiProperty({
    description: 'Property ID related to the inquiry',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  propertyId?: string;

  @ApiProperty({ description: 'Message related to the inquiry' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'about related to the inquiry' })
  @IsString()
  about: string;

  @ApiProperty({
    description: 'Status of the inquiry',
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'PENDING',
  })
  @IsString()
  @IsOptional()
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}
