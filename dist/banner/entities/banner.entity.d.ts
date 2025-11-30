/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
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
export declare const BannerSchema: import("mongoose").Schema<Banner, import("mongoose").Model<Banner, any, any, any, Document<unknown, any, Banner> & Banner & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Banner, Document<unknown, {}, import("mongoose").FlatRecord<Banner>> & import("mongoose").FlatRecord<Banner> & {
    _id: Types.ObjectId;
}>;
