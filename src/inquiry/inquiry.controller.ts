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
  UseGuards,
  Req,
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
import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { AuthGuard } from '@nestjs/passport';
import { CreateBrokerInquiryDto } from './dto/create-agent-inquiry.dto';
import { Types } from 'mongoose';

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
      createInquiryDto.userId = Types.ObjectId.isValid(createInquiryDto.userId)
        ? new Types.ObjectId(createInquiryDto.userId)
        : createInquiryDto.userId;
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
      updateInquiryDto.userId = Types.ObjectId.isValid(updateInquiryDto.userId)
        ? new Types.ObjectId(updateInquiryDto.userId)
        : updateInquiryDto.userId;
      const updatedInquiry = await this.inquiryService.update(
        id,
        updateInquiryDto,
      );
      if (!updatedInquiry) {
        throw new NotFoundException('Inquiry not found');
      }
      return updatedInquiry;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the inquiry.',
      );
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
  @Get('customer-inquiry/:customerId')
  @ApiOperation({
    summary: 'Retrieve inquiries by customer ID with pagination and sorting',
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
  @ApiOkResponse({
    description: 'List of inquiries for the customer retrieved successfully',
    type: [Inquiry],
  })
  @ApiNotFoundResponse({
    description: 'No inquiries found for the customer',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findByCustomerId(
    @Param('customerId') customerId: string,
    @Query('pageSize') pageSize: string = '10',
    @Query('pageNumber') pageNumber: string = '1',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
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
      const data = await this.inquiryService.findByCustomerId(
        customerId,
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
      );
      if (!data.inquiries || data.inquiries.length === 0) {
        throw new NotFoundException('No inquiries found for the customer');
      }
      return { data, message: 'Retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }
  // inquiry from agent app
  @Post('by-agent')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new inquiry by agent' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Inquiry created successfully by agent',
    type: Inquiry,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async createByAgent(
    @Body() createInquiryDto: CreateBrokerInquiryDto,
    @Req() req: any,
  ) {
    try {
      const agent = req.user._id; // Assuming the agent's information is stored in req.user
      // const agent = '67626f1b6178dd67fffa9ad3';
      const data = await this.inquiryService.createInquiry(
        createInquiryDto,
        agent,
      );
      return {
        data,
        message: 'Inquiry created successfully by agent',
      };
    } catch (error) {
      throw error;
    }
  }
  @Patch('by-agent/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update an inquiry by agent' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inquiry updated successfully by agent',
    type: Inquiry,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inquiry not found',
  })
  async updateByAgent(
    @Param('id') id: string,
    @Body() updateInquiryDto: UpdateInquiryDto,
    @Req() req: any,
  ) {
    try {
      const agent = req.user._id;
      // const agent = '67626f1b6178dd67fffa9ad3';
      const data = await this.inquiryService.updateInquiry(
        id,
        updateInquiryDto,
        agent,
      );
      return {
        data,
        message: 'Inquiry updated successfully by agent',
      };
    } catch (error) {
      throw error;
    }
  }
}
