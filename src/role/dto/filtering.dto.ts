import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilteringDto {
  @ApiProperty({ description: 'Filter by name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Filter by description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
