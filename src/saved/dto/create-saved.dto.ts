import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateSavedDto {
  @ApiProperty({
    description: 'The ID of the user who saved the item',
    example: '60d5f4c71c4d88c154a98192',
  })
  @Type(() => String)
  user: Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the saved project',
    example: '60d5f4c71c4d88c154a98193',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  project?: Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the saved property',
    example: '60d5f4c71c4d88c154a98194',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  property?: Types.ObjectId;

  @ApiProperty({
    description: 'Indicates whether the saved item is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
