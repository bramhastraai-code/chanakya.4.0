// user-behavior.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserBehaviorType } from '../entities/user-behavior.entity';

export class DeviceInfoDto {
  @ApiPropertyOptional({
    description: 'Operating system of the user device',
    example: 'Windows 10',
  })
  @IsOptional()
  @IsString()
  os?: string;

  @ApiPropertyOptional({
    description: 'Browser used by the user',
    example: 'Chrome 115',
  })
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiPropertyOptional({
    description: 'Type of device',
    example: 'desktop',
  })
  @IsOptional()
  @IsString()
  deviceType?: string;
}

export class TrackUserBehaviorDto {
  @ApiProperty({
    description: 'ID of the user',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  user: string;

  @ApiPropertyOptional({
    description: 'Type of user (optional)',
    example: 'new',
    enum: ['new', 'old'],
  })
  @IsOptional()
  @IsEnum(['new', 'old'])
  userType?: 'new' | 'old';

  @ApiProperty({
    description: 'Session ID for tracking user journey',
    example: 'session_abc123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Type of user behavior event',
    enum: UserBehaviorType,
    example: UserBehaviorType.PAGE_VIEW,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(UserBehaviorType)
  type: UserBehaviorType;

  @ApiPropertyOptional({
    description: 'Firebase Cloud Messaging token for push notifications',
    example: 'sample_fcm_token',
  })
  @IsOptional()
  @IsString()
  fcmToken?: string;

  @ApiProperty({
    description: 'URL of the page where the event occurred',
    example: 'https://example.com/products',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  pageUrl: string;

  @ApiPropertyOptional({
    description: 'Title of the page',
    example: 'Product Listing Page',
  })
  @IsOptional()
  @IsString()
  pageTitle?: string;

  @ApiProperty({
    description: 'Section of the website/app where event occurred',
    example: 'product-listing',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  section: string;

  @ApiPropertyOptional({
    description: 'Referrer URL',
    example: 'https://google.com',
  })
  @IsOptional()
  @IsString()
  referrer?: string;

  @ApiPropertyOptional({
    description: 'IP address of the user',
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Device information',
    type: DeviceInfoDto,
  })
  @IsOptional()
  @IsObject()
  deviceInfo?: DeviceInfoDto;

  @ApiPropertyOptional({
    description: 'Call-to-action element ID',
    example: 'cta-button-1',
  })
  @IsOptional()
  @IsString()
  ctaId?: string;

  @ApiPropertyOptional({
    description: 'Type of CTA element',
    example: 'button',
  })
  @IsOptional()
  @IsString()
  ctaType?: string;

  @ApiPropertyOptional({
    description: 'Text content of the CTA element',
    example: 'Buy Now',
  })
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata about the event',
    example: { productId: '123', price: 99.99 },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UserBehaviorResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the behavior record',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'User ID associated with the event',
    example: '507f1f77bcf86cd799439011',
  })
  user: string;

  @ApiProperty({
    description: 'Session ID',
    example: 'session_abc123',
  })
  sessionId: string;

  @ApiProperty({
    enum: UserBehaviorType,
    example: UserBehaviorType.PAGE_VIEW,
  })
  type: UserBehaviorType;

  @ApiProperty({
    example: 'https://example.com/products',
  })
  pageUrl: string;

  @ApiPropertyOptional({
    example: 'Product Listing Page',
  })
  pageTitle?: string;

  @ApiProperty({
    example: 'product-listing',
  })
  section: string;

  @ApiPropertyOptional({
    example: 'https://google.com',
  })
  referrer?: string;

  @ApiPropertyOptional({
    example: '192.168.1.1',
  })
  ipAddress?: string;

  @ApiPropertyOptional({
    type: DeviceInfoDto,
  })
  deviceInfo?: DeviceInfoDto;

  @ApiPropertyOptional({
    example: 'cta-button-1',
  })
  ctaId?: string;

  @ApiPropertyOptional({
    example: 'button',
  })
  ctaType?: string;

  @ApiPropertyOptional({
    example: 'Buy Now',
  })
  ctaText?: string;

  @ApiPropertyOptional({
    example: { productId: '123', price: 99.99 },
    type: Object,
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    type: Date,
    example: '2023-08-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: '2023-08-15T10:00:00.000Z',
  })
  updatedAt: Date;
}
