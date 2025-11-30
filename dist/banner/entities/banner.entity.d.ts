import { Document, Types } from 'mongoose';
export type ContentType = 'Image' | 'Video';
export type AdType = 'Banner' | 'Popup' | 'Sidebar';
export type IndustrySegment = 'RealEstate' | 'ElectricalAppliances' | 'ConstructionMaterials' | 'Services' | 'ProductRelatedToRealEstate';
export declare class Banner extends Document {
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
    executionArea?: {
        region: string;
        city?: string;
        country?: string;
    }[];
    industrySegment: IndustrySegment;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
}
export declare const BannerSchema: import("mongoose").Schema<Banner, import("mongoose").Model<Banner, any, any, any, Document<unknown, any, Banner, any, {}> & Banner & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Banner, Document<unknown, {}, import("mongoose").FlatRecord<Banner>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Banner> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
