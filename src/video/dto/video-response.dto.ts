import { ApiProperty } from '@nestjs/swagger';
import { VideoSourceType, VideoStatus } from '../enums/video.enum';

export class VideoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: VideoSourceType })
  sourceType: VideoSourceType;

  @ApiProperty({ required: false })
  s3Key?: string;

  @ApiProperty({ required: false })
  youtubeUrl?: string;

  @ApiProperty({ enum: VideoStatus })
  status: VideoStatus;

  @ApiProperty()
  publicUrl: string;

  @ApiProperty({ required: false })
  approvedAt?: Date;

  @ApiProperty({ required: false })
  rejectedAt?: Date;

  @ApiProperty({ required: false })
  rejectionReason?: string;

  @ApiProperty()
  earnings: number;

  @ApiProperty({ required: false })
  projectId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
