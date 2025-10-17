import { TagVariant } from '../enum/property.enum';
export declare class CrmDetailsDto {
    crmName: string;
    crmProfileImageUrl: string;
    crmResponseTime: string;
    crmMobile: string;
    crmRole: string;
}
export declare class EnquiryDetailDto {
    listingId: string;
    title: string;
    price: number;
    location: string;
}
export declare class PropertyDetailDto {
    className?: string;
    listingId: string;
    title: string;
    location: string;
    price: string;
    images: string[];
    tags: {
        text: string;
        variant: TagVariant;
        iconUrl: string;
    }[];
    amenities: {
        text: string;
        iconLocation: string;
    }[];
    featured?: boolean;
    crmDetails: CrmDetailsDto;
    about: string;
    videoUrl: string;
    enquiryDetail: EnquiryDetailDto;
}
