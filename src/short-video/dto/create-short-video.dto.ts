import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsMongoId,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Status } from 'src/common/enum/status.enum';

export class CreateShortVideoDto {
  @ApiProperty({
    description: 'URL of the video',
    example: 'https://example.com/video.mp4',
  })
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    description: 'Thumbnail URL of the video',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    description: 'Title of the video',
    example: 'Amazing Property Tour',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Description of the video',
    example: 'A quick overview of the property and its features.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Number of views',
    example: 1000,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  views?: number;

  @ApiProperty({
    description: 'Number of likes',
    example: 500,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  likes?: number;

  @ApiProperty({
    description: 'Number of shares',
    example: 200,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  shares?: number;

  @ApiProperty({
    description: 'Priority of the short video',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  priority?: number;

  @ApiProperty({
    description: 'Status of the video',
    enum: Status,
    example: Status.ACTIVE,
    default: Status.IN_ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    description: 'ID of the associated project',
    example: '64f5b5a5f0e4d9a4e8c3d6e8',
  })
  @IsNotEmpty()
  @IsMongoId()
  associatedProject: string;
}

export class IncrementStatDto {
  @IsString()
  @IsIn(['view', 'like', 'share'], {
    message: 'key must be one of the following: view, like, share',
  })
  key: string;
}
