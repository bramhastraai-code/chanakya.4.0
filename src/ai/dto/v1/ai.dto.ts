import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  Min,
} from 'class-validator';

export class GenerateDescriptionDto {
  @ApiProperty({ example: 'Apartment' })
  @IsString()
  propertyType: string;

  @ApiProperty({ example: '3 BHK' })
  @IsString()
  configuration: string;

  @ApiProperty({ example: 'Whitefield, Bangalore' })
  @IsString()
  location: string;

  @ApiProperty({ example: ['Swimming Pool', 'Gym', '24/7 Security'] })
  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @ApiPropertyOptional({
    example: 'Near Metro Station, Brand new construction',
  })
  @IsString()
  @IsOptional()
  highlights?: string;
}

export class EstimatePriceDto {
  @ApiProperty({ example: 'Whitefield, Bangalore' })
  @IsString()
  location: string;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  @Min(1)
  sizeSqft: number;

  @ApiProperty({ example: 'Apartment' })
  @IsString()
  propertyType: string;

  @ApiProperty({ example: '3 BHK' })
  @IsString()
  configuration: string;
}

export class ChatDto {
  @ApiProperty({ example: 'What are the best areas to invest in Bangalore?' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: 'User is looking for budget homes' })
  @IsString()
  @IsOptional()
  context?: string;
}
