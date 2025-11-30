import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { RequirementStatus } from '../enum/requirement.enum';

export class UpdateRequirementDto {
  @ApiPropertyOptional({ enum: RequirementStatus })
  @IsEnum(RequirementStatus)
  @IsOptional()
  status?: RequirementStatus;
}
