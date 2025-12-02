import { BHKConfiguration, FacingDirection, FurnishingStatus, OfferVariant, PGAvailableFor, PlotType, PropertyCategory, PropertyLabel, PropertyPurpose, PropertyStatus, PropertyType, TagVariant } from '../enum/property.enum';
import { Status } from 'src/common/enum/status.enum';
declare class NearbyDto {
    resource: string;
    distance: string;
}
export declare class TagDto {
    text?: string;
    variant?: TagVariant;
    iconUrl?: string;
}
export declare class OfferDto {
    text?: string;
    variant?: OfferVariant;
    description?: string;
}
export declare class CreatePropertyDto {
    listingId: string;
    thumbnail: string;
    propertyTitle: string;
    propertyDescription: string;
    propertyOwner?: string;
    ownerNumber?: string;
    propertyExecutive?: string;
    propertyType: PropertyType;
    propertyPurpose: PropertyPurpose;
    propertyStatus: PropertyStatus;
    propertyLabel: PropertyLabel;
    nearby?: NearbyDto[];
    propertyCategory: PropertyCategory;
    bhkConfiguration: BHKConfiguration;
    furnishingStatus: FurnishingStatus;
    propertyAge: number;
    propertyAgeMonth: number;
    totalArea: number;
    carpetArea: number;
    balconyCount: number;
    bathroomCount: number;
    bedCount: number;
    parkingCount: number;
    floorNumber: number;
    totalFloors: number;
    facingDirection: FacingDirection;
    amenities: string[];
    facilities: string[];
    address: string;
    city: string;
    state: string;
    region: string;
    landmark: string;
    roadDistance: number;
    latitude: number;
    longitude: number;
    country: string;
    pinCode: string;
    price: number;
    pricePerUnit: number;
    maintenanceCharge: number;
    deposit: number;
    totalPrice: number;
    images: string[];
    videoLink: string;
    floorPlan: string;
    masterPlan: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    washroomFor: string;
    plotType?: PlotType;
    pgAvailableFor: PGAvailableFor;
    status: Status;
    builderId?: string;
    projectId?: string;
    tags?: TagDto[];
    offers?: OfferDto[];
    featured: boolean;
    createdBy?: string;
    customer?: string;
    updatedBy?: string;
    ownerId?: string;
    views?: number;
}
export {};
