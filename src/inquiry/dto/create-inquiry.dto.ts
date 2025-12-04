import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsEnum, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInquiryDto {
  @ApiProperty({
    description: 'Email of the person making the inquiry',
    required: false,
  })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Name of the person making the inquiry',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    required: false,
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Company name',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyname?: string;

  @ApiProperty({
    description: 'Title of the inquiry',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Type of the inquiry',
    enum: [
      'common',
      'groupBuy',
      'agentSelection',
      'quickBuy',
      'siteVisit',
      'loan',
      'advisory',
    ],
    default: 'common',
    required: false,
  })
  @IsEnum([
    'common',
    'groupBuy',
    'agentSelection',
    'quickBuy',
    'siteVisit',
    'loan',
    'advisory',
  ])
  @IsString()
  @IsOptional()
  inquiryType?:
    | 'common'
    | 'groupBuy'
    | 'agentSelection'
    | 'quickBuy'
    | 'siteVisit'
    | 'loan'
    | 'advisory';

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

  @ApiProperty({
    description: 'Detailed message of the inquiry',
    required: true,
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'About what the inquiry is regarding',
    required: true,
  })
  @IsString()
  about: string;

  @ApiProperty({
    description: 'Date of the site visit',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : value))
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
    description: 'Status of the inquiry',
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'PENDING',
    required: false,
  })
  @IsEnum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
  @IsString()
  @IsOptional()
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}
