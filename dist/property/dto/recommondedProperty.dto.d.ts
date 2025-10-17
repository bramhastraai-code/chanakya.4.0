import { OfferDto, TagDto } from './create-property.dto';
export declare class PropertySummaryDto {
    thumbnail: string;
    propertyTitle: string;
    address: string;
    price: number;
    propertyStatus: string;
    totalArea: number;
    bedCount: number;
    pricePerUnit: number;
    tags: TagDto[];
    offers: OfferDto[];
    featured: boolean;
}
