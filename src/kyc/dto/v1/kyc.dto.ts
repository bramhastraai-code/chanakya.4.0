import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentType } from '../../enum/kyc.enum';

export class KycDocumentDto {
  @ApiProperty({ enum: DocumentType, example: DocumentType.PAN })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ example: 'ABCDE1234F' })
  @IsString()
  number: string;

  @ApiProperty({ example: 'https://example.com/pan-front.jpg' })
  @IsString()
  frontImageUrl: string;

  @ApiPropertyOptional({ example: 'https://example.com/pan-back.jpg' })
  @IsString()
  @IsOptional()
  backImageUrl?: string;
}

export class SubmitKycDto {
  @ApiProperty({ type: [KycDocumentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KycDocumentDto)
  documents: KycDocumentDto[];
}

export class ReviewKycDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  approved: boolean;

  @ApiPropertyOptional({ example: 'Documents are unclear' })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
