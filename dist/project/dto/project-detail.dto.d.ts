import { Property } from 'src/property/entities/property.entity';
export declare class ProjectDetailDto {
    id?: string;
    className?: string;
    projectName: string;
    address: string;
    PropertyConfig: string[];
    price: string;
    pricePerAre: string;
    thumbnail: string;
    listingId: string;
    configuration: string[];
    lat: string;
    long: string;
    carpetArea: number[];
    priceMin: number;
    priceMax: number;
    builderInfo: string;
    builderLogoSrc: string;
    builderId: string;
    builderName: string;
    totalProject: number;
    readyToPossessDate: string;
    crmDetails: {
        crmName: string;
        crmRole: string;
        crmProfileImageUrl: string;
        crmMobile: string;
        crmResponseTime: string;
    };
    property: Property;
}
