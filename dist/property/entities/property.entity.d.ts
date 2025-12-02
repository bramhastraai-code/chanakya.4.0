import { Document, Types } from 'mongoose';
import { Project } from 'src/project/entities/project.entity';
import { BHKConfiguration, FacingDirection, FurnishingStatus, OfferVariant, PGAvailableFor, PlotType, PropertyCategory, PropertyPurpose, PropertyStatus, PropertyType, TagVariant } from '../enum/property.enum';
import { Status } from 'src/common/enum/status.enum';
export declare class Property extends Document {
    thumbnail: string;
    propertyTitle: string;
    propertyDescription?: string;
    propertyOwner?: string;
    OwnerContactNumber?: string;
    propertyExecutive?: string;
    propertyType?: PropertyType;
    propertyPurpose?: PropertyPurpose;
    propertyStatus?: PropertyStatus;
    propertyCategory?: PropertyCategory;
    bhkConfiguration?: BHKConfiguration;
    furnishingStatus?: FurnishingStatus;
    propertyAge?: number;
    propertyAgeMonth?: number;
    totalArea?: number;
    carpetArea?: number;
    balconyCount?: number;
    bathroomCount?: number;
    bedCount?: number;
    parkingCount?: number;
    floorNumber?: number;
    totalFloors?: number;
    facingDirection?: FacingDirection;
    amenities?: Types.Array<Types.ObjectId>;
    facilities?: Types.Array<Types.ObjectId>;
    address?: string;
    city?: string;
    state?: string;
    region?: string;
    landmark?: string;
    roadDistance?: number;
    latitude?: number;
    longitude?: number;
    country?: string;
    pinCode?: string;
    price?: number;
    pricePerUnit?: number;
    maintenanceCharge?: number;
    deposit?: number;
    totalPrice?: number;
    images?: string[];
    videoLink?: string;
    floorPlan?: string;
    masterPlan?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    plotType?: PlotType;
    pgAvailableFor?: PGAvailableFor;
    tags?: {
        text: string;
        variant: TagVariant;
        iconUrl: string;
    }[];
    offers: {
        text: string;
        variant: OfferVariant;
        description: string;
    }[];
    featured?: boolean;
    builderId?: Types.ObjectId;
    projectId?: Project;
    ownerId: Types.ObjectId;
    customer?: Types.ObjectId;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    approvalStatus: string;
    approvalNotes?: string;
    rejectionReason?: string;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    views?: number;
    status?: Status;
    nearby?: Array<{
        resource: string;
        distance: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const PropertySchema: import("mongoose").Schema<Property, import("mongoose").Model<Property, any, any, any, Document<unknown, any, Property, any, {}> & Property & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Property, Document<unknown, {}, import("mongoose").FlatRecord<Property>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Property> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
