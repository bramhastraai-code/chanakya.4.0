import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VideoStatus } from '../enums/video.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVideoStatusDto {
  @ApiProperty({
    description: 'The new status of the video',
    enum: VideoStatus,
    example: VideoStatus.APPROVED,
  })
  @IsNotEmpty()
  @IsEnum(VideoStatus)
  status: VideoStatus;

  @ApiPropertyOptional({
    description: 'Reason for rejection if status is REJECTED',
    example: 'Video contains prohibited content',
    required: false,
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
