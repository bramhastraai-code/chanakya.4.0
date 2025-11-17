import { Document, Schema as MongooseSchema } from 'mongoose';
import { Amenity } from 'src/amenity/entities/amenity.entity';
import { Builder } from 'src/builder/entities/builder.entity';
import { User } from 'src/user/entity/user.entity';
import { ProjectAffordability, ProjectCategory } from '../enum/project.enum';
import { Status } from 'src/common/enum/status.enum';
import { BHKConfiguration, OfferVariant, TagVariant } from 'src/property/enum/property.enum';
import { Property } from 'src/property/entities/property.entity';
import { ProjectStatus } from '../project.enum';
export declare class Project extends Document {
    projectName: string;
    thumbnail: string;
    description: string;
    builder: Builder;
    projectType: string;
    projectCategory: ProjectCategory;
    projectAffordability: ProjectAffordability;
    projectStatus?: ProjectStatus;
    PropertyConfig: BHKConfiguration[];
    priceAverage: number;
    priceMin?: number;
    priceMax?: number;
    videoLink?: string;
    floorPlan?: string;
    masterPlan?: string;
    nearby?: Array<{
        resource: string;
        distance: number;
    }>;
    minCarpetArea?: number;
    maxCarpetArea?: number;
    since?: number;
    address: string;
    city: string;
    pinCode: string;
    state: string;
    region: string;
    landmark: string;
    roadDistance: number;
    latitude: number;
    longitude: number;
    amenities: Amenity[];
    facilities: Amenity[];
    properties: Property[];
    images: string[];
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    reraNo: string;
    view: number;
    status: Status;
    tags: {
        text: string;
        variant: TagVariant;
        iconUrl: string;
    }[];
    offers: {
        text: string;
        variant: OfferVariant;
        description: string;
    }[];
    createdBy?: User;
    updatedBy?: User;
    featured?: boolean;
    exclusive?: boolean;
    executiveUser?: User;
    readyToPossessDate: string;
    quickBuy?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProjectSchema: MongooseSchema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project, any, {}> & Project & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Project> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
