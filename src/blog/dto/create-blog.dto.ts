import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Title of the blog',
    example: 'Understanding NestJS Modules',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content of the blog',
    example: 'NestJS modules are used to organize the application...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Description of the blog',
    example: 'This blog post covers the basics of NestJS modules.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'SEO-friendly slug for the blog',
    example: 'understanding-nestjs-modules',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Optional cover image URL for the blog',
    example: 'https://example.com/images/cover.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    description: 'Category of the blog',
    example: 'Technology',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'SEO title for the blog',
    example: 'Learn NestJS Modules in Depth',
    required: false,
  })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiProperty({
    description: 'SEO description for the blog',
    example: 'A comprehensive guide to NestJS modules and their usage.',
    required: false,
  })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiProperty({
    description: 'SEO keywords for the blog',
    example: ['NestJS', 'Modules', 'Backend Development'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  seoKeywords?: string[];

  @ApiProperty({
    description: 'Author ID (MongoDB ObjectId)',
    example: '64f7a5e899b3c25b4d2df456',
  })
  @IsMongoId()
  @IsOptional()
  authorId: string;

  @ApiProperty({
    description: 'Created by user ID (MongoDB ObjectId)',
    example: '64f7a5e899b3c25b4d2df456',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({
    description: 'Status of the blog',
    example: 'active',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  @IsEnum(['active', 'inactive'])
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Updated by user ID (MongoDB ObjectId)',
    example: '64f7a5e899b3c25b4d2df456',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  updatedBy?: string;
}
