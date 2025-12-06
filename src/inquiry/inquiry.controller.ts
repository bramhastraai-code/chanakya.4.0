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
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { Response } from 'src/common/interceptor/response.interface';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inquiry' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Inquiry created successfully',
    type: Inquiry,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(
    @Body() createInquiryDto: CreateInquiryDto,
  ): Promise<Response<Inquiry>> {
    try {
      const data = await this.inquiryService.create(createInquiryDto);
      return { data, message: 'Inquiry created successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Patch('inquiry/:id')
  @ApiOperation({ summary: 'Update an existing inquiry' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inquiry updated successfully',
    type: Inquiry,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inquiry not found',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async update(
    @Param('id') id: string,
    @Body() updateInquiryDto: UpdateInquiryDto,
  ): Promise<Inquiry> {
    try {
      const updatedInquiry = await this.inquiryService.update(
        id,
        updateInquiryDto,
      );
      if (!updatedInquiry) {
        throw new NotFoundException('Inquiry not found');
      }
      return updatedInquiry;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary:
      'Retrieve all inquiries with pagination, sorting, search, inquiryType, and status filter',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
    description: 'Number of inquiries per page',
  })
  @ApiQuery({
    name: 'pageNumber',
    type: Number,
    required: false,
    description: 'Page number to retrieve',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    enum: ['createdAt', 'updatedAt', 'status'],
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
    description: 'Search term for filtering inquiries',
  })
  @ApiQuery({
    name: 'inquiryType',
    type: String,
    required: false,
    enum: ['common', 'groupBuy', 'agentSelection', 'quickBuy', 'siteVisit'],
    description: 'Filter by inquiry type',
  })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    description: 'Filter by inquiry status',
  })
  @ApiQuery({
    name: 'projectId',
    type: String,
    required: false,
    description: 'Filter inquiries by project ID',
  })
  @ApiQuery({
    name: 'propertyId',
    type: String,
    required: false,
    description: 'Filter inquiries by property ID',
  })
  @ApiQuery({
    name: 'builderId',
    type: String,
    required: false,
    description: 'Filter inquiries by builder ID (via project/property)',
  })
  @ApiOkResponse({
    description: 'List of inquiries retrieved successfully',
    type: [Inquiry],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(
    @Query('pageSize') pageSize: string = '10',
    @Query('pageNumber') pageNumber: string = '1',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('searchQuery') searchQuery?: string,
    @Query('inquiryType')
    inquiryType?:
      | 'common'
      | 'groupBuy'
      | 'agentSelection'
      | 'quickBuy'
      | 'siteVisit',
    @Query('status')
    status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED',
    @Query('projectId') projectId?: string,
    @Query('propertyId') propertyId?: string,
    @Query('builderId') builderId?: string,
  ): Promise<
    Response<{
      inquiries: Inquiry[];
      totalPages: number;
      totalInquiries: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.inquiryService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
        inquiryType,
        status,
        projectId,
        propertyId,
        builderId,
      );

      return { data, message: 'Retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('inquiry/:id')
  @ApiOperation({ summary: 'Retrieve a single inquiry by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The inquiry details',
    type: Inquiry,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inquiry not found',
  })
  async findOne(@Param('id') id: string): Promise<Response<Inquiry>> {
    try {
      const inquiry = await this.inquiryService.findOne(id);
      if (!inquiry) {
        throw new NotFoundException('Inquiry not found');
      }
      return { data: inquiry, message: 'Retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Delete('inquiry/:id')
  @ApiOperation({ summary: 'Delete an inquiry by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Inquiry deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inquiry not found',
  })
  async remove(
    @Param('id') id: string,
  ): Promise<{ data: string; message: string }> {
    try {
      const result = await this.inquiryService.remove(id);
      if (result.deletedCount === 0) {
        throw new NotFoundException('Inquiry not found');
      }
      return { data: 'DELETE successfully', message: 'delete successful' };
    } catch (error) {
      throw error;
    }
  }
}
