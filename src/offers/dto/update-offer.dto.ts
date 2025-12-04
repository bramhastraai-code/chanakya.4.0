import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  Min,
  IsDate,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OfferStatus } from '../enum/offer.enum';

export class UpdateOfferDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  incentiveAmount?: number;

  @ApiPropertyOptional({ enum: OfferStatus })
  @IsEnum(OfferStatus)
  @IsOptional()
  status?: OfferStatus;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  termsAndConditions?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minUnitsToSell?: number;

  @ApiPropertyOptional({
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPercentage?: number;

  @ApiPropertyOptional({
    description: 'Offer valid from date in ISO 8601 format',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validFrom?: Date;

  @ApiPropertyOptional({
    description: 'Offer valid until date in ISO 8601 format',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validUntil?: Date;
}
