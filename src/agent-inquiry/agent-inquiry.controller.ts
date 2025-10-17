import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AgentInquiryService } from './agent-inquiry.service';
import { CreateAgentInquiryDto } from './dto/create-agent-inquiry.dto';
import { UpdateAgentInquiryDto } from './dto/update-agent-inquiry.dto';
import { AgentInquiry } from './entities/agent-inquiry.entity';
import { Response } from 'src/common/interceptor/response.interface';
import { Status } from 'src/common/enum/status.enum';

@ApiTags('agent-inquiries')
@Controller('agent-inquiries')
export class AgentInquiryController {
  constructor(private readonly agentInquiryService: AgentInquiryService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of agent inquiries' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Page size' })
  @ApiQuery({ name: 'pageNumber', required: false, description: 'Page number' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order' })
  @ApiQuery({
    name: 'searchQuery',
    required: false,
    description: 'Search query',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  @ApiResponse({ status: 200, description: 'List of agent inquiries' })
  async findAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'desc' | 'asc',
    @Query('searchQuery') searchQuery?: string,
    @Query('status') status?: Status,
  ): Promise<
    Response<{
      inquiries: AgentInquiry[];
      totalPages: number;
      totalInquiries: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    const data = await this.agentInquiryService.findAll(
      pageSize,
      pageNumber,
      sortBy,
      sortOrder,
      searchQuery,
      status,
    );
    return { data, message: 'Agent inquiries retrieved successfully' };
  }

  @Get('agent-inquiry/:id')
  @ApiOperation({ summary: 'Get an agent inquiry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Agent inquiry retrieved',
    type: AgentInquiry,
  })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  async findOne(@Param('id') id: string): Promise<Response<AgentInquiry>> {
    const data = await this.agentInquiryService.findOne(id);
    return { data, message: 'Agent inquiry retrieved successfully' };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new agent inquiry' })
  @ApiResponse({
    status: 201,
    description: 'Inquiry created',
    type: AgentInquiry,
  })
  @ApiResponse({ status: 409, description: 'Phone number already in use' })
  async create(
    @Body() createAgentInquiryDto: CreateAgentInquiryDto,
  ): Promise<Response<AgentInquiry>> {
    const data = await this.agentInquiryService.create(createAgentInquiryDto);
    return { data, message: 'Agent inquiry created successfully' };
  }

  @Patch('agent-inquiry/:id')
  @ApiOperation({ summary: 'Update an agent inquiry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Inquiry updated',
    type: AgentInquiry,
  })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAgentInquiryDto: UpdateAgentInquiryDto,
  ): Promise<Response<AgentInquiry>> {
    const data = await this.agentInquiryService.update(
      id,
      updateAgentInquiryDto,
    );
    return { data, message: 'Agent inquiry updated successfully' };
  }

  @Delete('agent-inquiry/:id')
  @ApiOperation({ summary: 'Delete an agent inquiry by ID' })
  @ApiResponse({ status: 200, description: 'Inquiry deleted' })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  async remove(@Param('id') id: string): Promise<Response<AgentInquiry>> {
    const data = await this.agentInquiryService.remove(id);
    return { data, message: 'Agent inquiry deleted successfully' };
  }

  @Post('add-agent-form')
  @ApiOperation({ summary: 'Add a new agent form' })
  @ApiResponse({
    status: 201,
    description: 'Agent form added',
    type: AgentInquiry,
  })
  @ApiResponse({ status: 409, description: 'Phone number already in use' })
  async addAgentForm(
    @Body() createAgentInquiryDto: CreateAgentInquiryDto,
  ): Promise<Response<AgentInquiry>> {
    try {
      const data = await this.agentInquiryService.addAgentForm(
        createAgentInquiryDto,
      );
      return { data, message: 'Agent form added successfully' };
    } catch (error) {
      throw error;
    }
  }
}
