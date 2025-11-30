import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsEnum,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentType } from '../enum/kyc.enum';

class DocumentDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ example: '123456789012' })
  @IsString()
  number: string;

  @ApiProperty({ example: 'https://cdn.chanakyaai.com/kyc/aadhaar_front.jpg' })
  @IsString()
  frontImage: string;

  @ApiPropertyOptional({ example: 'https://cdn.chanakyaai.com/kyc/aadhaar_back.jpg' })
  @IsString()
  @IsOptional()
  backImage?: string;
}

class AddressProofDto {
  @ApiProperty({ example: 'electricity_bill' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'https://cdn.chanakyaai.com/kyc/address_proof.jpg' })
  @IsString()
  image: string;
}

export class SubmitKycDto {
  @ApiProperty({ type: [DocumentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents: DocumentDto[];

  @ApiPropertyOptional({ type: AddressProofDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressProofDto)
  addressProof?: AddressProofDto;
}
