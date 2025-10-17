import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAmenityDto {
  @ApiProperty({
    description: 'The name of the amenity',
    example: 'Swimming Pool',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the amenity',
    example: 'Swimming Pool is beautiful',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: ' icon image URL for the amenity',
    example: 'https://picsum.photos/200',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  iconImage?: string;

  @ApiProperty({
    description: 'The ID of the user who created the amenity',
    example: '60d5f5c6c8e6b1a3f8a2b3c4',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({
    description: 'The ID of the user who last updated the amenity',
    example: '60d5f5c6c8e6b1a3f8a2b3c4',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  updatedBy?: string;
}
