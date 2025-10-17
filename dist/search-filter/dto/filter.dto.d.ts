import { EntityType } from '../enum/search.enum';
import { BHKConfiguration, PropertyType } from 'src/property/enum/property.enum';
export declare class PropertyFilterDto {
    search?: string;
    city?: string;
    page: number;
    limit: number;
    type: EntityType;
}
export declare class PropertyFilter_V2_Dto {
    search?: string;
    city?: string;
    page: number;
    limit: number;
    type: EntityType;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    sort?: string;
    propertyType?: PropertyType;
    propertyConfig?: BHKConfiguration[];
}
