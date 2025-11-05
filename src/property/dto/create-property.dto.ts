import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  BHKConfiguration,
  FacingDirection,
  FurnishingStatus,
  OfferVariant,
  PGAvailableFor,
  PlotType,
  PropertyCategory,
  PropertyLabel,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
  TagVariant,
} from '../enum/property.enum';
import { Status } from 'src/common/enum/status.enum';

class NearbyDto {
  @ApiProperty({ description: 'Resource name', example: 'Hospital' })
  @IsString()
  resource: string;

  @ApiProperty({
    description: 'Distance to the resource in meters',
    example: 500,
  })
  distance: string;
}

export class TagDto {
  @ApiProperty({
    description: 'Text of the tag',
    example: 'new',
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({
    description: 'Variant of the tag',
    enum: TagVariant,
    example: 'feature',
  })
  @IsOptional()
  @IsEnum(TagVariant)
  variant?: TagVariant;

  @ApiProperty({
    description: 'URL of the icon associated with the tag',
    example: 'https://example.com/icon.png',
  })
  @IsOptional()
  @IsString()
  iconUrl?: string;
}

export class OfferDto {
  @ApiProperty({
    description: 'Text of the offer',
    example: 'new',
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({
    description: 'Variant of the offer',
    enum: OfferVariant,
    example: 'promo',
  })
  @IsOptional()
  @IsEnum(OfferVariant)
  variant?: OfferVariant;

  @ApiProperty({
    description: 'Text of the offer',
    example: '20% off',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePropertyDto {
  @ApiProperty({
    description: 'The id of the project',
    example: '#XXXXXXX',
  })
  @IsString()
  @IsNotEmpty()
  listingId: string;
  // Main details
  @ApiProperty({
    description: 'Property title',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @ApiProperty({
    description: 'Property title',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  propertyTitle: string;

  @ApiProperty({
    description: 'Property description',
    example: 'A spacious 3 BHK apartment with sea view.',
    required: false,
  })
  @IsOptional()
  @IsString()
  propertyDescription: string;

  @ApiProperty({
    description: 'Property Owner',
    example: 'Rakesh',
    required: false,
  })
  @IsOptional()
  @IsString()
  propertyOwner?: string;

  @ApiProperty({
    description: 'Property owner number',
    example: '+919993313+++.',
    required: false,
  })
  @IsOptional()
  @IsString()
  ownerNumber?: string;

  @ApiProperty({
    description: 'Property Executive',
    example: 'Yogesh',
    required: false,
  })
  @IsOptional()
  @IsString()
  propertyExecutive?: string;

  @ApiProperty({
    description: 'Type of property',
    enum: PropertyType,
    required: false,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType: PropertyType;

  @ApiProperty({
    description: 'Purpose of property',
    enum: PropertyPurpose,
    required: false,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(PropertyPurpose)
  @IsOptional()
  propertyPurpose: PropertyPurpose;

  @ApiProperty({
    required: false,
    description: 'Status of the property',
    enum: PropertyStatus,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(PropertyStatus)
  @IsOptional()
  propertyStatus: PropertyStatus;

  @ApiProperty({
    required: false,
    description: 'Status of the property',
    enum: PropertyLabel,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(PropertyLabel)
  @IsOptional()
  propertyLabel: PropertyLabel;

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
    description: 'Category of the property',
    enum: PropertyCategory,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(PropertyCategory)
  @IsOptional()
  propertyCategory: PropertyCategory;

  // Configuration
  @ApiProperty({
    required: false,
    description: 'BHK configuration',
    enum: BHKConfiguration,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(BHKConfiguration)
  @IsOptional()
  bhkConfiguration: BHKConfiguration;

  @ApiProperty({
    required: false,
    description: 'Furnishing status',
    enum: FurnishingStatus,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(FurnishingStatus)
  @IsOptional()
  furnishingStatus: FurnishingStatus;

  @ApiProperty({
    required: false,
    description: 'Age of the property in years',
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  propertyAge: number;

  @ApiProperty({
    required: false,
    description: 'Age of the property in months',
    example: 6,
  })
  @IsOptional()
  @IsNumber()
  propertyAgeMonth: number;

  @ApiProperty({
    required: false,
    description: 'Total area of the property in square feet',
    example: 1500,
  })
  @IsOptional()
  totalArea: number;

  @ApiProperty({
    required: false,
    description: 'Carpet area of the property in square feet',
    example: 1200,
  })
  @IsOptional()
  @IsNumber()
  carpetArea: number;

  @ApiProperty({
    required: false,
    description: 'Number of balconies',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  balconyCount: number;

  @ApiProperty({
    required: false,
    description: 'Number of bathrooms',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  bathroomCount: number;

  @ApiProperty({
    required: false,
    description: 'Number of beds',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  bedCount: number;

  @ApiProperty({
    required: false,
    description: 'Number of parking spaces',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  parkingCount: number;

  @ApiProperty({
    required: false,
    description: 'Floor number',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  floorNumber: number;

  @ApiProperty({
    required: false,
    description: 'Total number of floors in the building',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  totalFloors: number;

  @ApiProperty({
    required: false,
    description: 'Facing direction of the property',
    enum: FacingDirection,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(FacingDirection)
  @IsOptional()
  facingDirection: FacingDirection;

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
  amenities: string[];

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
  facilities: string[];

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
    description: 'Landmark near the property',
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
  @IsNumber()
  roadDistance: number;

  @ApiProperty({
    required: false,
    description: 'Latitude for property location',
    example: '40.712776',
  })
  @IsOptional()
  @IsNumber()
  latitude: number;

  @ApiProperty({
    required: false,
    description: 'Longitude for property location',
    example: '-74.005974',
  })
  @IsOptional()
  @IsNumber()
  longitude: number;

  @ApiProperty({
    required: false,
    description: 'Country where the property is located',
    example: 'USA',
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    required: false,
    description: 'Pincode/ZIP code of the property location',
    example: '10001',
  })
  @IsOptional()
  @IsString()
  pinCode: string;

  // Pricing details
  @ApiProperty({
    required: false,
    description: 'Property price',
    example: 1000000,
  })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({
    required: false,
    description: 'Price per unit (e.g., per square foot)',
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  pricePerUnit: number;

  @ApiProperty({
    required: false,
    description: 'Maintenance charge',
    example: 5000,
  })
  @IsOptional()
  @IsNumber()
  maintenanceCharge: number;

  @ApiProperty({
    required: false,
    description: 'Deposit amount',
    example: 20000,
  })
  @IsOptional()
  @IsNumber()
  deposit: number;

  @ApiProperty({
    required: false,
    description: 'Total price of the property',
    example: 1200000,
  })
  @IsOptional()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    required: false,
    description: 'Images Url ',
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

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

  // SEO
  @ApiProperty({
    required: false,
    description: 'SEO title for the property page',
  })
  @IsOptional()
  @IsString()
  seoTitle: string;

  @ApiProperty({
    required: false,
    description: 'SEO description for the property page',
  })
  @IsOptional()
  @IsString()
  seoDescription: string;

  @ApiProperty({
    required: false,
    description: 'SEO keywords for the property page',
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords: string[];

  // Additional information
  @ApiProperty({
    required: false,
    description: 'Description of the washroom',
    example: 'Common washroom for guests',
  })
  @IsOptional()
  @IsString()
  washroomFor: string;

  @ApiProperty({
    required: false,
    description: 'Type of the plot',
    enum: PlotType,
  })
  @IsOptional()
  @IsString()
  plotType?: PlotType;

  @ApiProperty({
    required: false,
    description: 'Is the property available for PG?',
    enum: PGAvailableFor,
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsEnum(PGAvailableFor)
  @IsOptional()
  pgAvailableFor: PGAvailableFor;

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

  // Relations
  @ApiProperty({
    required: false,
    description: 'ID of the builder',
    example: '60d5f447c1375b6b4c8f6a2f',
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsOptional()
  @IsMongoId()
  builderId?: string;

  @ApiProperty({
    required: false,
    description: 'ID of the project',
    example: '60d5f447c1375b6b4c8f6a30',
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform((params) => (params.value === '' ? null : params.value))
  @IsOptional()
  @IsMongoId()
  projectId?: string;

  // @ApiProperty({
  //   required: false,
  //   description: 'List of inquiry IDs',
  //   type: [String],
  //   example: ['60d5f447c1375b6b4c8f6a2f'],
  // })

  // @IsOptional()
  // @IsArray()
  // @IsMongoId({ each: true })
  // inquiries?: string[];

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
  @ValidateNested({ each: true })
  offers?: OfferDto[];

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
    description: 'ID of the user who created the property',
    example: '60d5f447c1375b6b4c8f6a31',
  })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;

  @ApiProperty({
    required: false,
    description: 'ID of the Customer who owned the property',
    example: '60d5f447c1375b6b4c8f6a31',
  })
  @IsOptional()
  @IsMongoId()
  customer?: string;

  @ApiProperty({
    required: false,
    description: 'ID of the user who updated the property',
    example: '60d5f447c1375b6b4c8f6a32',
  })
  @IsOptional()
  @IsMongoId()
  updatedBy?: string;

  // Metadata
  @ApiProperty({
    required: false,
    description: 'Number of views',
    example: 1000,
  })
  @IsOptional()
  views?: number;
}
