import {
  Body,
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ShortVideoService } from './short-video.service';
import { ShortVideo } from './entities/short-video.entity';
import { CreateShortVideoDto } from './dto/create-short-video.dto';
import { UpdateShortVideoDto } from './dto/update-short-video.dto';
import { Response } from 'src/common/interceptor/response.interface';

@ApiTags('short-videos')
@Controller('short-videos')
export class ShortVideoController {
  constructor(private readonly shortVideoService: ShortVideoService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a new short video' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Short video uploaded successfully',
    type: ShortVideo,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(
    @Body() createShortVideoDto: CreateShortVideoDto,
  ): Promise<Response<ShortVideo>> {
    try {
      const data = await this.shortVideoService.create(createShortVideoDto);
      console.log(data);

      return { data, message: 'Short video uploaded successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing short video' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Short video updated successfully',
    type: ShortVideo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Short video not found',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async update(
    @Param('id') id: string,
    @Body() updateShortVideoDto: UpdateShortVideoDto,
  ): Promise<Response<ShortVideo>> {
    try {
      const data = await this.shortVideoService.update(id, updateShortVideoDto);
      if (!data) {
        throw new NotFoundException('Short video not found');
      }
      return { data, message: 'Short video updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the short video.',
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all short videos with pagination, sorting, and search',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: true,
    description: 'Number of short videos per page',
  })
  @ApiQuery({
    name: 'pageNumber',
    type: Number,
    required: true,
    description: 'Page number to retrieve',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    enum: ['title', 'createdAt', 'updatedAt'],
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'searchQuery',
    type: String,
    required: false,
    description: 'Search term for filtering short videos',
  })
  @ApiOkResponse({
    description: 'List of short videos retrieved successfully',
    type: [ShortVideo],
  })
  @ApiNotFoundResponse({
    description: 'No short videos found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchQuery') searchQuery?: string,
  ): Promise<
    Response<{
      shortVideos: ShortVideo[];
      totalPages: number;
      totalVideos: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.shortVideoService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
      );

      if (!data?.shortVideos || data.shortVideos.length === 0) {
        throw new NotFoundException('No short videos found');
      }

      return { data, message: 'Videos retrieved successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the short videos.',
      );
    }
  }

  @Get('short/:id')
  @ApiOperation({ summary: 'Retrieve a single short video by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The short video details',
    type: ShortVideo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Short video not found',
  })
  async findOne(@Param('id') id: string): Promise<Response<ShortVideo>> {
    try {
      const video = await this.shortVideoService.findOne(id);
      if (!video) {
        throw new NotFoundException('Short video not found');
      }
      return { data: video, message: 'Video retrieved successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Delete('short/:id')
  @ApiOperation({ summary: 'Delete a short video by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Short video deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Short video not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const result = await this.shortVideoService.remove(id);
      if (result.deletedCount === 0) {
        throw new NotFoundException('Short video not found');
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('web/video-list')
  @ApiOperation({
    summary: 'Get a list of short videos with pagination',
    description: 'Fetches a list of short videos with pagination support.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of short videos fetched successfully',
  })
  async getVideoList(
    @Query('page') page: number = 1, // Default page is 1
    @Query('limit') limit: number = 10, // Default limit is 10
  ) {
    const data = await this.shortVideoService.videoList(page, limit);
    return { data, message: 'Videos retrieved successfully' };
  }

  @Patch('web/:id/increment-stat')
  @ApiOperation({
    summary: 'Increment stat for views, likes, or shares',
    description:
      'Increment the count of views, likes, or shares for a short video.',
  })
  @ApiResponse({
    status: 200,
    description: 'The stat was successfully incremented',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid stat key',
  })
  @ApiResponse({
    status: 404,
    description: 'Short video not found',
  })
  async incrementStat(
    @Param('id') id: string, // Short video ID
    @Query('key') key: 'views' | 'likes' | 'shares', // Extract key from query parameters
  ) {
    if (!['views', 'likes', 'shares'].includes(key)) {
      throw new BadRequestException('Invalid stat key');
    }

    const data = await this.shortVideoService.incrementStat(id, key);
    return { data, message: 'Stat incremented successfully' };
  }
}
