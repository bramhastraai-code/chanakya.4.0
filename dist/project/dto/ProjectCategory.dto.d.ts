import { ProjectAffordability, ProjectCategory } from '../enum/project.enum';
export declare class GetProjectByCategoryDto {
    category?: ProjectCategory;
}
export declare class GetProjectByAffordabilityDto {
    affordability?: ProjectAffordability;
    city?: string;
}
