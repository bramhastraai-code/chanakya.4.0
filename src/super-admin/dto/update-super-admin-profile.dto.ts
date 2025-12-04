import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateSuperAdminProfileDto {
  @ApiPropertyOptional({ example: 'Admin Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: ['60d5ecb8b392d7001f8e8e8e', '60d5ecb8b392d7001f8e8e8f'],
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
