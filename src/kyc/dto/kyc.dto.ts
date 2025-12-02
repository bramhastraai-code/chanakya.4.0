import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { DocumentType } from '../enums/kyc.enum';

export class SubmitKycDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'ABCDE1234F' })
  @IsString()
  panNumber: string;

  @ApiProperty({ example: '123456789012' })
  @IsString()
  aadharNumber: string;

  @ApiProperty({ example: '123 Main Street, City, State - 123456' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'https://cdn.example.com/pan-card.jpg' })
  @IsString()
  panCardImageUrl: string;

  @ApiProperty({ example: 'https://cdn.example.com/aadhar-front.jpg' })
  @IsString()
  aadharCardFrontImageUrl: string;

  @ApiProperty({ example: 'https://cdn.example.com/aadhar-back.jpg' })
  @IsString()
  aadharCardBackImageUrl: string;

  @ApiProperty({ example: 'https://cdn.example.com/profile-photo.jpg' })
  @IsString()
  profilePhotoUrl: string;
}

export class UpdateKycDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'ABCDE1234F' })
  @IsString()
  @IsOptional()
  panNumber?: string;

  @ApiPropertyOptional({ example: '123456789012' })
  @IsString()
  @IsOptional()
  aadharNumber?: string;

  @ApiPropertyOptional({ example: '123 Main Street, City, State - 123456' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/pan-card.jpg' })
  @IsString()
  @IsOptional()
  panCardImageUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/aadhar-front.jpg' })
  @IsString()
  @IsOptional()
  aadharCardFrontImageUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/aadhar-back.jpg' })
  @IsString()
  @IsOptional()
  aadharCardBackImageUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/profile-photo.jpg' })
  @IsString()
  @IsOptional()
  profilePhotoUrl?: string;
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
