import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAssociationDto {
  @ApiPropertyOptional({
    description: 'Whether the association is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Additional notes about the association',
    example: 'Updated commission structure agreed',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
