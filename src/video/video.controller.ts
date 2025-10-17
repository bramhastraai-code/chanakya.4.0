import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoStatusDto } from './dto/update-video-status.dto';
import { VideoResponseDto } from './dto/video-response.dto';
import { Response } from 'src/common/interceptor/response.interface';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { VideoService } from './video.service';
import { AuthGuard } from '@nestjs/passport';
import { Video } from './entities/video.entity';

@ApiTags('Videos')
@ApiBearerAuth()
@Controller('videos')
export class VideoController {
  constructor(private readonly videosService: VideoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new video entry' })
  @ApiBody({ type: CreateVideoDto })
  @ApiCreatedResponse({
    description: 'Video created successfully',
    type: VideoResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @Req() req: any,
  ): Promise<Response<VideoResponseDto>> {
    const id = req.user._id;
    const video = await this.videosService.create(id, createVideoDto);
    const data = this.mapToDto(video);
    return { data, message: 'created successfully' };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all videos for current user' })
  @ApiOkResponse({
    description: 'Videos retrieved successfully',
    type: [VideoResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findAllByUser(@Req() req: any): Promise<Response<VideoResponseDto[]>> {
    const id = req.user._id;
    const videos = await this.videosService.findAllByUser(id);
    return { data: videos.map(this.mapToDto), message: 'retrieve the message' };
  }

  @Get('earnings')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get total earnings for current user' })
  @ApiOkResponse({
    description: 'Earnings calculated successfully',
    schema: {
      type: 'object',
      properties: {
        earnings: { type: 'number', example: 25000 },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getEarnings(@Req() req: any): Promise<Response<{ earnings: number }>> {
    const id = req.user._id;
    const earnings = await this.videosService.calculateEarnings(id);
    return { data: { earnings }, message: 'retrieved Successfully.' };
  }

  @Get('video/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a specific video' })
  @ApiParam({
    name: 'id',
    description: 'Video ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Video retrieved successfully',
    type: VideoResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Video not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findOne(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<Response<VideoResponseDto>> {
    const userId = req.user._id;
    const video = await this.videosService.findOne(id, userId);
    const data = this.mapToDto(video);
    return { data, message: 'retrieved successfully' };
  }

  @Post(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update video status (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Video ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateVideoStatusDto })
  @ApiOkResponse({
    description: 'Video status updated successfully',
    type: VideoResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Video not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateVideoStatusDto: UpdateVideoStatusDto,
  ): Promise<Response<VideoResponseDto>> {
    const video = await this.videosService.updateStatus(
      id,
      updateVideoStatusDto,
    );
    const data = this.mapToDto(video);
    return { data, message: 'updated successfully' };
  }

  private mapToDto(video: Video): VideoResponseDto {
    const dto = new VideoResponseDto();
    Object.assign(dto, video.toJSON());
    dto.id = video._id.toString();
    return dto;
  }
}
