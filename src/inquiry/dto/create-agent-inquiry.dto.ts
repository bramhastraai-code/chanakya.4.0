import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
export class CreateBrokerInquiryDto {
  @ApiProperty({ description: 'Contact number of the broker' })
  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @ApiPropertyOptional({ description: 'Name of the broker' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Address of the broker' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'City of the broker' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'Title of the inquiry' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Type of inquiry',
    enum: ['common', 'groupBuy', 'agentSelection', 'quickBuy', 'siteVisit'],
  })
  @IsEnum(['common', 'groupBuy', 'agentSelection', 'quickBuy', 'siteVisit'])
  @IsOptional()
  inquiryType?:
    | 'common'
    | 'groupBuy'
    | 'agentSelection'
    | 'quickBuy'
    | 'siteVisit';

  @ApiPropertyOptional({ description: 'Project ID related to the inquiry' })
  @IsOptional()
  projectId?: string | Types.ObjectId;

  @ApiPropertyOptional({ description: 'Property ID related to the inquiry' })
  @IsOptional()
  propertyId?: string | Types.ObjectId;

  @ApiProperty({ description: 'Message content of the inquiry' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'About the inquiry' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiPropertyOptional({
    description: 'Date for site visit',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  siteVisitDate?: Date;

  @ApiPropertyOptional({ description: 'Time for site visit' })
  @IsString()
  @IsOptional()
  siteVisitTime?: string;

  @ApiProperty({
    description: 'Status of the inquiry',
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'PENDING',
  })
  @IsString()
  @IsOptional()
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}
