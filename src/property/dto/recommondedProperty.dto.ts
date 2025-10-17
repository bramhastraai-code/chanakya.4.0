import { ApiProperty } from '@nestjs/swagger';
import { OfferDto, TagDto } from './create-property.dto';

export class PropertySummaryDto {
  @ApiProperty({ example: 'https://example.com/thumbnail.jpg' })
  thumbnail: string;

  @ApiProperty({ example: 'Luxury Villa' })
  propertyTitle: string;

  @ApiProperty({ example: '123 Main Street, City, State' })
  address: string;

  @ApiProperty({ example: 250000 })
  price: number;

  @ApiProperty({ example: 'Available' })
  propertyStatus: string;

  @ApiProperty({ example: 1500 })
  totalArea: number;

  @ApiProperty({ example: 3 })
  bedCount: number;

  @ApiProperty({ example: 166.67 })
  pricePerUnit: number;

  @ApiProperty()
  tags: TagDto[];

  @ApiProperty()
  offers: OfferDto[];

  @ApiProperty()
  featured: boolean;
}
