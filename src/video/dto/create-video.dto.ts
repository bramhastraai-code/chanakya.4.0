import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { VideoSourceType } from '../enums/video.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({
    description: 'Title of the video',
    example: 'My Awesome Video',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the video',
    example: 'This video demonstrates amazing features',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Type of video source',
    enum: VideoSourceType,
    enumName: 'VideoSourceType',
    example: VideoSourceType.S3,
  })
  @IsNotEmpty()
  @IsEnum(VideoSourceType)
  sourceType: VideoSourceType;

  @ApiPropertyOptional({
    description: 'S3 key for the video file (required if sourceType is S3)',
    example: 'uploads/user123/123456789-video.mp4',
  })
  @ValidateIf((o) => o.sourceType === VideoSourceType.S3)
  @IsNotEmpty()
  @IsString()
  s3Key?: string;

  @ApiPropertyOptional({
    description: 'YouTube URL (required if sourceType is YOUTUBE)',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @ValidateIf((o) => o.sourceType === VideoSourceType.YOUTUBE)
  @IsNotEmpty()
  @IsUrl()
  youtubeUrl?: string;

  @ApiPropertyOptional({
    description: 'ID of the associated project',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  projectId?: string;
}
