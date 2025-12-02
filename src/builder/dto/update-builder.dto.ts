import { PartialType } from '@nestjs/swagger';
import { CreateBuilderDto } from './create-builder.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateBuilderDto extends PartialType(CreateBuilderDto) {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
