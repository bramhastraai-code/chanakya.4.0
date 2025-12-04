import { User } from 'aws-sdk/clients/budgets';
import { ProjectAffordability, ProjectCategory } from '../enum/project.enum';
import { OfferDto, TagDto } from 'src/property/dto/create-property.dto';
import { Status } from 'src/common/enum/status.enum';
import { BHKConfiguration } from 'src/property/enum/property.enum';
import { ProjectStatus, ProjectType } from '../project.enum';
declare class NearbyDto {
    resource: string;
    distance: string;
}
export declare class CreateProjectDto {
    listingId: string;
    projectName: string;
    description: string;
    thumbnail: string;
    builder: string;
    projectType: ProjectType;
    quickBuy?: boolean;
    projectCategory: ProjectCategory;
    projectAffordability: ProjectAffordability;
    projectStatus?: ProjectStatus;
    PropertyConfig: BHKConfiguration[];
    priceAverage?: number;
    priceMin?: number;
    minCarpetArea?: number;
    maxCarpetArea?: number;
    priceMax?: number;
    since?: number;
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
    amenities?: string[];
    facilities?: string[];
    inquiries: string[];
    tags?: TagDto[];
    offers?: OfferDto[];
    status: Status;
    images?: string[];
    seoTitle?: string;
    readyToPossessDate?: string;
    seoDescription?: string;
    videoLink: string;
    floorPlan: string;
    masterPlan: string;
    seoKeywords?: string[];
    reraNo?: string;
    featured: boolean;
    exclusive: boolean;
    view?: number;
    active?: boolean;
    nearby?: NearbyDto[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    executiveUser: User;
    updatedBy: User;
}
declare const UpdateProjectDto_base: import("@nestjs/common").Type<Partial<CreateProjectDto>>;
export declare class UpdateProjectDto extends UpdateProjectDto_base {
}
export {};
