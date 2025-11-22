import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
  IsUrl,
  IsBoolean,
  IsNumber,
  ValidateIf,
  IsDate,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'aws-sdk/clients/budgets';
import { ProjectAffordability, ProjectCategory } from '../enum/project.enum';
import { OfferDto, TagDto } from 'src/property/dto/create-property.dto';
import { Status } from 'src/common/enum/status.enum';
import { BHKConfiguration } from 'src/property/enum/property.enum';
import { ProjectStatus } from '../project.enum';

class NearbyDto {
  @ApiProperty({ description: 'Resource name', example: 'Hospital' })
  @IsString()
  resource: string;

  @ApiProperty({
    description: 'Distance to the resource in meters',
    example: 500,
  })
  @IsString()
  distance: string;
}

export class CreateProjectDto {
  @ApiProperty({
    description: 'The id of the project',
    example: '#XXXXXXX',
  })
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @ApiProperty({
    description: 'The name of the project',
    example: 'Project Alpha',
  })
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({
    description: 'The description of the project',
    example: 'Project Alpha is awesome ',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The thumbnail URL of the project',
    example: 'http://example.com/thumbnail.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({
    description: 'The ID of the builder',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsMongoId()
  @IsNotEmpty()
  builder: string;

  @ApiProperty({
    description: 'The type of the project',
    example: 'Residential',
    required: false,
  })
  @IsString()
  @IsOptional()
  projectType?: string;

  @ApiProperty({
    required: false,
    description: 'Indicates if the project is available for quick buy',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Prop({ default: false })
  quickBuy?: boolean;

  @ApiProperty({
    required: false,
    description: 'Is the property available for PG?',
    enum: ProjectCategory,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(ProjectCategory)
  @IsOptional()
  projectCategory: ProjectCategory;

  @ApiProperty({
    required: false,
    description: 'Is the property is luxury or affordable?',
    enum: ProjectAffordability,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(ProjectAffordability)
  @IsOptional()
  projectAffordability: ProjectAffordability;

  @ApiProperty({
    description: 'The status of the project',
    example: 'Ready to move',
    required: false,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  projectStatus?: ProjectStatus;

  @ApiPropertyOptional({
    description: 'Max Price of property',
    example: ['2bhk', '3bhk'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(BHKConfiguration, { each: true })
  PropertyConfig: BHKConfiguration[];

  @ApiPropertyOptional({
    description: 'Average Price of property',
    example: 20000,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  priceAverage?: number;

  @ApiPropertyOptional({
    description: 'Min Price of property',
    example: 20000,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  priceMin?: number;

  @ApiPropertyOptional({
    description: 'Mon carpet area of property',
    example: 1000000,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  minCarpetArea?: number;

  @ApiPropertyOptional({
    description: 'max carpet of property',
    example: 20000,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  maxCarpetArea?: number;

  @ApiPropertyOptional({
    description: 'Max Price of property',
    example: 1000000,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  priceMax?: number;

  @ApiPropertyOptional({
    description: 'project start from ',
    example: 2022,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  since?: number;

  // Address details
  @ApiProperty({
    required: false,
    description: 'Full address of the property',
    example: '123 Main Street, Downtown',
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    required: false,
    description: 'City where the property is located',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty({
    required: false,
    description: 'State where the property is located',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty({
    required: false,
    description: 'region name',
    example: 'Manhattan',
  })
  @IsOptional()
  @IsString()
  region: string;

  @ApiProperty({
    required: false,
    description: 'Landmark near the project',
    example: 'Near Central Park',
  })
  @IsOptional()
  @IsString()
  landmark: string;

  @ApiProperty({
    required: false,
    description: 'Distance from the main road in meters',
    example: 100,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  roadDistance: number;

  @ApiProperty({
    required: false,
    description: 'Latitude for project location',
    example: '40.712776',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    required: false,
    description: 'Longitude for project location',
    example: '-74.005974',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    required: false,
    description: 'Country where the project is located',
    example: 'USA',
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    required: false,
    description: 'Pincode/ZIP code of the project location',
    example: '10001',
  })
  @IsOptional()
  pinCode: string;
  // Amenities & Facilities
  @ApiProperty({
    required: false,
    description: 'List of amenity IDs',
    type: [String],
    example: ['60d5f447c1375b6b4c8f6a2f'],
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  amenities?: string[];

  @ApiProperty({
    required: false,
    description: 'List of facility IDs',
    type: [String],
    example: ['60d5f447c1375b6b4c8f6a2f'],
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  facilities?: string[];

  @ApiProperty({
    required: false,
    description: 'List of inquiry IDs',
    type: [String],
    example: ['60d5f447c1375b6b4c8f6a2f'],
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  inquiries: string[];

  @ApiProperty({
    required: false,
    description: 'List of tags associated with the property',
    type: [TagDto],
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @IsOptional()
  @IsArray()
  tags?: TagDto[];

  @ApiProperty({
    required: false,
    description: 'List of tags associated with the property',
    type: [OfferDto],
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @IsOptional()
  @IsArray()
  offers?: OfferDto[];

  @ApiProperty({
    required: false,
    description: 'status of property active inactive ',
    enum: Status,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(Status)
  @IsOptional()
  status: Status;

  @ApiProperty({
    description: 'List of image URLs',
    example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => String)
  images?: string[];

  @ApiProperty({
    description: 'SEO title',
    example: 'Project Alpha - Best Project',
    required: false,
  })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiProperty({
    description: 'readyToPossessDate',
    example: '03 dec 2024',
    required: false,
  })
  @IsString()
  @IsOptional()
  readyToPossessDate?: string;

  @ApiProperty({
    description: 'SEO description',
    example: 'Description of Project Alpha',
    required: false,
  })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiProperty({
    required: false,
    description: 'Video link of the property',
    example: 'https://example.com/video.mp4',
  })
  @IsOptional()
  videoLink: string;

  @ApiProperty({
    description: 'Floor pLan Url',
    required: true,
  })
  @IsOptional()
  @IsString()
  floorPlan: string;
  @ApiProperty({
    description: 'Master Plan Url',
    required: true,
  })
  @IsOptional()
  @IsString()
  masterPlan: string;

  @ApiProperty({
    description: 'SEO keywords',
    example: ['project', 'alpha', 'best'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => String)
  seoKeywords?: string[];

  @ApiProperty({
    description: 'RERA number',
    example: 'RERA1234567',
    required: false,
  })
  @IsString()
  @IsOptional()
  reraNo?: string;

  @ApiProperty({
    required: false,
    description: 'Indicates if the property is featured',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  featured: boolean;

  @ApiProperty({
    required: false,
    description: 'Indicates if the property is featured',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  exclusive: boolean = false;

  @ApiProperty({ description: 'View count', example: 100, required: false })
  @IsNumber()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsOptional()
  view?: number;

  @ApiProperty({
    description: 'Active status of the project',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({
    type: [NearbyDto],
    description: 'Nearby resources with distances',
  }) // Optional Swagger property
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NearbyDto)
  nearby?: NearbyDto[];

  @ApiProperty({
    required: false,
    description: 'Creation date',
    example: '2024-08-25T10:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    required: false,
    description: 'Last update date',
    example: '2024-08-26T10:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    description: 'created by',
    example: '60d0fe4f5311236168a109ca',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @ApiProperty({
    description: 'Executive User ',
    example: '60d0fe4f5311236168a109ca',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  executiveUser: User;

  @ApiProperty({
    description: 'updated by ',
    example: '60d0fe4f5311236168a109ca',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
