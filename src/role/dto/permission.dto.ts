import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'The resource name' })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiProperty({ description: 'Permission to create', default: false })
  @IsBoolean()
  create: boolean;

  @ApiProperty({ description: 'Permission to read', default: false })
  @IsBoolean()
  read: boolean;

  @ApiProperty({ description: 'Permission to update', default: false })
  @IsBoolean()
  update: boolean;

  @ApiProperty({ description: 'Permission to delete', default: false })
  @IsBoolean()
  delete: boolean;
}
