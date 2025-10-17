import { ApiProperty } from '@nestjs/swagger';
import { Property } from 'src/property/entities/property.entity';

export class ProjectDetailDto {
  @ApiProperty({ description: 'CSS class for custom styling' })
  id?: string;

  @ApiProperty({ description: 'CSS class for custom styling' })
  className?: string;

  @ApiProperty({ description: 'Name of the project' })
  projectName: string;

  @ApiProperty({ description: 'Address of the project' })
  address: string;

  @ApiProperty({
    type: [String],
    description: 'List of property configurations',
  })
  PropertyConfig: string[];

  @ApiProperty({ description: 'Price of the project' })
  price: string;

  @ApiProperty({ description: 'Price per area' })
  pricePerAre: string;

  @ApiProperty({ description: 'URL of the project thumbnail' })
  thumbnail: string;

  @ApiProperty({ description: 'Listing ID for the project' })
  listingId: string;

  @ApiProperty({
    type: [String],
    description: 'List of project configurations',
  })
  configuration: string[];

  @ApiProperty({ description: 'Latitude coordinate' })
  lat: string;

  @ApiProperty({ description: 'Longitude coordinate' })
  long: string;

  @ApiProperty({ type: [String], description: 'List of carpet area sizes' })
  carpetArea: number[];

  @ApiProperty({ description: 'Minimum price of the project' })
  priceMin: number;

  @ApiProperty({ description: 'Maximum price of the project' })
  priceMax: number;

  @ApiProperty({ description: 'Information about the builder' })
  builderInfo: string;

  @ApiProperty({ description: "URL of the builder's logo" })
  builderLogoSrc: string;

  @ApiProperty({ description: 'ID of the builder' })
  builderId: string;

  @ApiProperty({ description: 'Name of the builder' })
  builderName: string;

  @ApiProperty({ description: 'Total number of projects' })
  totalProject: number;

  @ApiProperty({ description: 'Date when the project is ready to possess' })
  readyToPossessDate: string;

  @ApiProperty({
    description: 'CRM details of the project',
  })
  crmDetails: {
    crmName: string;
    crmRole: string;
    crmProfileImageUrl: string;
    crmMobile: string;
    crmResponseTime: string;
  };
  property: Property;
}
