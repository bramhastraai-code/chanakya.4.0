import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  IsBoolean,
  Min,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PropertyType,
  PropertyPurpose,
  PropertyStatus,
  PropertyCategory,
  BHKConfiguration,
  FurnishingStatus,
  FacingDirection,
  PlotType,
  PGAvailableFor,
  TagVariant,
  OfferVariant,
} from '../../enum/property.enum';

class TagDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ enum: TagVariant })
  @IsEnum(TagVariant)
  variant: TagVariant;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  iconUrl?: string;
}

class OfferDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ enum: OfferVariant })
  @IsEnum(OfferVariant)
  variant: OfferVariant;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreatePropertyDto {
  @ApiProperty({ example: 'https://example.com/thumbnail.jpg' })
  @IsString()
  thumbnail: string;

  @ApiProperty({ example: 'Luxury 3BHK Apartment in Whitefield' })
  @IsString()
  propertyTitle: string;

  @ApiPropertyOptional({ example: 'Spacious apartment with modern amenities' })
  @IsString()
  @IsOptional()
  propertyDescription?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  propertyOwner?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  OwnerContactNumber?: string;

  @ApiPropertyOptional({ enum: PropertyType })
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @ApiPropertyOptional({ enum: PropertyPurpose })
  @IsEnum(PropertyPurpose)
  @IsOptional()
  propertyPurpose?: PropertyPurpose;

  @ApiPropertyOptional({ enum: PropertyStatus })
  @IsEnum(PropertyStatus)
  @IsOptional()
  propertyStatus?: PropertyStatus;

  @ApiPropertyOptional({ enum: PropertyCategory })
  @IsEnum(PropertyCategory)
  @IsOptional()
  propertyCategory?: PropertyCategory;

  @ApiPropertyOptional({ enum: BHKConfiguration })
  @IsEnum(BHKConfiguration)
  @IsOptional()
  bhkConfiguration?: BHKConfiguration;

  @ApiPropertyOptional({ enum: FurnishingStatus })
  @IsEnum(FurnishingStatus)
  @IsOptional()
  furnishingStatus?: FurnishingStatus;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  propertyAge?: number;

  @ApiPropertyOptional({ example: 1200 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalArea?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  carpetArea?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  balconyCount?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  bathroomCount?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  bedCount?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  parkingCount?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  floorNumber?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalFloors?: number;

  @ApiPropertyOptional({ enum: FacingDirection })
  @IsEnum(FacingDirection)
  @IsOptional()
  facingDirection?: FacingDirection;

  @ApiPropertyOptional({ example: ['amenity_id_1', 'amenity_id_2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiPropertyOptional({ example: ['facility_id_1', 'facility_id_2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  facilities?: string[];

  @ApiPropertyOptional({ example: '123 Main Street, Whitefield' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Bangalore' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: 'Whitefield' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ example: 'Near Phoenix Mall' })
  @IsString()
  @IsOptional()
  landmark?: string;

  @ApiPropertyOptional({ example: 12.9716 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: 77.5946 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ example: 'India' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: '560066' })
  @IsString()
  @IsOptional()
  pinCode?: string;

  @ApiPropertyOptional({ example: 5000000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 5000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  pricePerUnit?: number;

  @ApiPropertyOptional({ example: 3000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maintenanceCharge?: number;

  @ApiPropertyOptional({ example: 100000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  deposit?: number;

  @ApiPropertyOptional({ example: ['image1.jpg', 'image2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=...' })
  @IsUrl()
  @IsOptional()
  videoLink?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  floorPlan?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  masterPlan?: string;

  @ApiPropertyOptional({ example: 'Luxury Apartment in Whitefield' })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'Best luxury apartment...' })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ example: ['luxury', 'apartment', 'whitefield'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  seoKeywords?: string[];

  @ApiPropertyOptional({ enum: PlotType })
  @IsEnum(PlotType)
  @IsOptional()
  plotType?: PlotType;

  @ApiPropertyOptional({ enum: PGAvailableFor })
  @IsEnum(PGAvailableFor)
  @IsOptional()
  pgAvailableFor?: PGAvailableFor;

  @ApiPropertyOptional({ type: [TagDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  @IsOptional()
  tags?: TagDto[];

  @ApiPropertyOptional({ type: [OfferDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferDto)
  @IsOptional()
  offers?: OfferDto[];

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiPropertyOptional({ example: 'project_id' })
  @IsString()
  @IsOptional()
  projectId?: string;
}

export class UpdatePropertyDto {
  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.jpg' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'Updated Property Title' })
  @IsString()
  @IsOptional()
  propertyTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  propertyDescription?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  propertyOwner?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  OwnerContactNumber?: string;

  @ApiPropertyOptional({ enum: PropertyType })
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @ApiPropertyOptional({ enum: PropertyPurpose })
  @IsEnum(PropertyPurpose)
  @IsOptional()
  propertyPurpose?: PropertyPurpose;

  @ApiPropertyOptional({ enum: PropertyStatus })
  @IsEnum(PropertyStatus)
  @IsOptional()
  propertyStatus?: PropertyStatus;

  @ApiPropertyOptional({ enum: PropertyCategory })
  @IsEnum(PropertyCategory)
  @IsOptional()
  propertyCategory?: PropertyCategory;

  @ApiPropertyOptional({ enum: BHKConfiguration })
  @IsEnum(BHKConfiguration)
  @IsOptional()
  bhkConfiguration?: BHKConfiguration;

  @ApiPropertyOptional({ enum: FurnishingStatus })
  @IsEnum(FurnishingStatus)
  @IsOptional()
  furnishingStatus?: FurnishingStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  propertyAge?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalArea?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  carpetArea?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  balconyCount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  bathroomCount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  bedCount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  parkingCount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  floorNumber?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalFloors?: number;

  @ApiPropertyOptional({ enum: FacingDirection })
  @IsEnum(FacingDirection)
  @IsOptional()
  facingDirection?: FacingDirection;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  facilities?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  landmark?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pinCode?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  pricePerUnit?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  maintenanceCharge?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  deposit?: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  videoLink?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  floorPlan?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  masterPlan?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  seoKeywords?: string[];

  @ApiPropertyOptional({ enum: PlotType })
  @IsEnum(PlotType)
  @IsOptional()
  plotType?: PlotType;

  @ApiPropertyOptional({ enum: PGAvailableFor })
  @IsEnum(PGAvailableFor)
  @IsOptional()
  pgAvailableFor?: PGAvailableFor;

  @ApiPropertyOptional({ type: [TagDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  @IsOptional()
  tags?: TagDto[];

  @ApiPropertyOptional({ type: [OfferDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferDto)
  @IsOptional()
  offers?: OfferDto[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  projectId?: string;
}
