import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePermissionDto } from './permission.dto';

export class CreateRoleDto {
  @ApiProperty({ description: 'The name of the role' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the role', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: [CreatePermissionDto],
    description: 'List of permissions',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePermissionDto)
  permissions: CreatePermissionDto[];
}
