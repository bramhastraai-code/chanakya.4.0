import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  IsDate,
  IsEnum,
  ValidateNested,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export type ContentType = 'Image' | 'Video';
export type AdType = 'Banner' | 'Popup' | 'Sidebar';
export type IndustrySegment =
  | 'RealEstate'
  | 'ElectricalAppliances'
  | 'ConstructionMaterials'
  | 'Services'
  | 'ProductRelatedToRealEstate';

class ExecutionAreaDto {
  @ApiProperty({ description: 'Region of the execution area' })
  @IsString()
  region: string;

  @ApiProperty({ description: 'City of the execution area', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Country of the execution area',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;
}

export class CreateBannerDto {
  @ApiProperty({ description: 'Title of the ad banner' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the ad banner' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Content type of the ad',
    enum: ['Image', 'Video'],
  })
  @IsEnum(['Image', 'Video'])
  contentType: ContentType;

  @ApiProperty({
    description: 'URL of the image if contentType is Image',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    description: 'URL of the video if contentType is Video',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @ApiProperty({
    description: 'URL of the mobile ad banner image',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrlForMobile?: string;

  @ApiProperty({ description: 'Link associated with the ad banner' })
  @IsString()
  link: string;

  @ApiProperty({
    description: 'Type of the ad',
    enum: ['Banner', 'Popup', 'Sidebar'],
  })
  @IsEnum(['Banner', 'Popup', 'Sidebar'])
  adType: AdType;

  @ApiProperty({ description: 'Is the ad banner active?' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Start date of the ad banner campaign',
    required: false,
  })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiProperty({
    description: 'End date of the ad banner campaign',
    required: false,
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiProperty({
    description: 'Additional information about the ad banner',
    required: false,
  })
  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @ApiProperty({
    description: 'Execution areas for the ad banner',
    type: [ExecutionAreaDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExecutionAreaDto)
  executionArea?: ExecutionAreaDto[];

  @ApiProperty({
    description: 'Industry segment related to the ad',
    enum: [
      'RealEstate',
      'ElectricalAppliances',
      'ConstructionMaterials',
      'Services',
      'ProductRelatedToRealEstate',
    ],
  })
  @IsEnum([
    'RealEstate',
    'ElectricalAppliances',
    'ConstructionMaterials',
    'Services',
    'ProductRelatedToRealEstate',
  ])
  industrySegment: IndustrySegment;

  @ApiProperty({ description: 'User ID of the creator', required: false })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;

  @ApiProperty({ description: 'User ID of the updater', required: false })
  @IsOptional()
  @IsMongoId()
  updatedBy?: string;
}
