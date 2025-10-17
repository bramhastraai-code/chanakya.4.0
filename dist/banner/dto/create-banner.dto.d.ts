export type ContentType = 'Image' | 'Video';
export type AdType = 'Banner' | 'Popup' | 'Sidebar';
export type IndustrySegment = 'RealEstate' | 'ElectricalAppliances' | 'ConstructionMaterials' | 'Services' | 'ProductRelatedToRealEstate';
declare class ExecutionAreaDto {
    region: string;
    city?: string;
    country?: string;
}
export declare class CreateBannerDto {
    title: string;
    description: string;
    contentType: ContentType;
    imageUrl?: string;
    videoUrl?: string;
    imageUrlForMobile?: string;
    link: string;
    adType: AdType;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    additionalInfo?: string;
    executionArea?: ExecutionAreaDto[];
    industrySegment: IndustrySegment;
    createdBy?: string;
    updatedBy?: string;
}
export {};
