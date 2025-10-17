import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectAffordability, ProjectCategory } from '../enum/project.enum';

export class GetProjectByCategoryDto {
  @IsEnum(ProjectCategory, { message: 'Invalid project category' })
  @IsOptional()
  category?: ProjectCategory;
}

export class GetProjectByAffordabilityDto {
  @IsEnum(ProjectAffordability, { message: 'Invalid project category' })
  @IsOptional()
  affordability?: ProjectAffordability;

  @IsOptional()
  @IsString()
  city?: string;
}
