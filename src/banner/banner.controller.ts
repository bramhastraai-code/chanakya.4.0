import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  InternalServerErrorException,
  NotFoundException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CreateBannerDto } from './dto/create-banner.dto';
import { Banner } from './entities/banner.entity';
import { Response } from 'src/common/interceptor/response.interface';
import { UpdateBannerDto } from './dto/update-banner.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BannerService } from './banner.service';

@ApiTags(' Banners')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new  banner' })
  @ApiBody({ type: CreateBannerDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ' banner created successfully',
    type: Banner,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(
    @Body() createBannerDto: CreateBannerDto,
  ): Promise<Response<Banner>> {
    try {
      const data = await this.bannerService.create(createBannerDto);
      return { data, message: 'created sucessfully banner ' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the  banner.',
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all  banners with optional search, filter, and sort',
  })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'pageNumber', type: Number, required: false })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    enum: ['createdAt', 'updatedAt'],
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'searchQuery',
    type: String,
    required: false,
    description: 'Search term for filtering banners by title or description',
  })
  @ApiQuery({ name: 'isActive', type: Boolean, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of  banners',
    type: Banner,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No banners found',
  })
  async findAll(
    @Query('pageSize') pageSize: string = '10',
    @Query('pageNumber') pageNumber: string = '1',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchQuery') searchQuery?: string,
    @Query('isActive') isActive?: boolean,
  ): Promise<
    Response<{
      banners: Banner[];
      totalPages: number;
      totalBanners: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.bannerService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
        isActive,
      );

      if (!data.banners || data.banners.length === 0) {
        throw new NotFoundException('No  banners found');
      }

      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving  banners.',
      );
    }
  }

  @Get('banner/:id')
  @ApiOperation({ summary: 'Retrieve an  banner by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ' banner retrieved successfully',
    type: Banner,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner not found',
  })
  async findOne(@Param('id') id: string): Promise<Response<Banner>> {
    try {
      const banner = await this.bannerService.findOne(id);
      if (!banner) {
        throw new NotFoundException(' banner not found');
      }
      return { data: banner, message: 'retrieve successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the  banner.',
      );
    }
  }

  @Patch('banner/:id')
  @ApiOperation({ summary: 'Update an  banner by ID' })
  @ApiBody({ type: UpdateBannerDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ' banner updated successfully',
    type: Banner,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner not found',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ): Promise<Banner> {
    try {
      const banner = await this.bannerService.update(id, updateBannerDto);
      if (!banner) {
        throw new NotFoundException(' banner not found');
      }
      return banner;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the  banner.',
      );
    }
  }

  @Delete('banner/:id')
  @ApiOperation({ summary: 'Delete an  banner by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: ' banner deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const result = await this.bannerService.remove(id);
      if (!result) {
        throw new NotFoundException(' banner not found');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the  banner.',
      );
    }
  }
  @Get('active')
  async getActiveBanners(): Promise<Banner[]> {
    return this.bannerService.getActiveBanners();
  }
}
