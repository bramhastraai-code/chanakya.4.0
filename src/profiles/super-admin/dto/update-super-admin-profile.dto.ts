import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateSuperAdminProfileDto {
  @ApiPropertyOptional({ example: 'Admin Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: ['users:manage', 'properties:approve', 'kyc:review'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];

  @ApiPropertyOptional({ example: 'Operations' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'Senior Administrator' })
  @IsString()
  @IsOptional()
  designation?: string;
}
