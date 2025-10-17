import { ApiProperty } from '@nestjs/swagger';
import { TagVariant } from '../enum/property.enum';

export class CrmDetailsDto {
  @ApiProperty({ example: 'Some CRM data' })
  crmName: string;
  crmProfileImageUrl: string;
  crmResponseTime: string;
  crmMobile: string;
  crmRole: string;
}

export class EnquiryDetailDto {
  @ApiProperty({ example: '12345' })
  listingId: string;

  @ApiProperty({ example: 'Luxury Apartment' })
  title: string;

  @ApiProperty({ example: 120000 })
  price: number;

  @ApiProperty({ example: 'New York' })
  location: string;
}

export class PropertyDetailDto {
  @ApiProperty({ example: 'property-class' })
  className?: string;

  @ApiProperty({ example: '12345' })
  listingId: string;

  @ApiProperty({ example: 'Luxury Apartment' })
  title: string;

  @ApiProperty({ example: 'New York, NY' })
  location: string;

  @ApiProperty({ example: '500,000 USD' })
  price: string;

  @ApiProperty({ type: [String], example: ['image1.jpg', 'image2.jpg'] })
  images: string[];

  @ApiProperty({
    example: [{ text: 'New', variant: TagVariant.ALERT, iconUrl: 'icon1.png' }],
  })
  tags: { text: string; variant: TagVariant; iconUrl: string }[];

  @ApiProperty({
    example: [{ text: 'Swimming Pool', iconLocation: 'icon-location.png' }],
  })
  amenities: { text: string; iconLocation: string }[];

  @ApiProperty({ example: true })
  featured?: boolean;

  @ApiProperty({ type: CrmDetailsDto })
  crmDetails: CrmDetailsDto;

  @ApiProperty({ example: 'This is a detailed description of the property.' })
  about: string;

  @ApiProperty({ example: 'https://video-url.com' })
  videoUrl: string;

  @ApiProperty({ type: EnquiryDetailDto })
  enquiryDetail: EnquiryDetailDto;
}
