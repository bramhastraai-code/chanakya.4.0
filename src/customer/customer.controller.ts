import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Response } from 'src/common/interceptor/response.interface';
import { UserStatus, UserType } from './enum/usertype.enum';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of customers' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of customers per page',
  })
  @ApiQuery({ name: 'pageNumber', required: false, description: 'Page number' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by',
  })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order' })
  @ApiQuery({
    name: 'searchQuery',
    required: false,
    description: 'Search query',
  })
  @ApiQuery({
    name: 'userType',
    required: false,
    description: ' userType',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'status',
  })
  @ApiResponse({ status: 200, description: 'List of customers' })
  async findAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'desc' | 'asc',
    @Query('searchQuery') searchQuery?: string,
    @Query('userType') userType?: UserType, // Optional filter by user type
    @Query('status') status?: UserStatus,
  ): Promise<
    Response<{
      customers: Customer[];
      totalPages: number;
      totalCustomers: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.customerService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
        userType,
        status,
      );
      return { data, message: 'created successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('customer/:id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({ status: 200, description: 'The customer', type: Customer })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(@Param('id') id: string): Promise<Response<Customer>> {
    try {
      const data = await this.customerService.findOne(id);
      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been created',
    type: Customer,
  })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Response<Customer>> {
    try {
      const data = await this.customerService.create(createCustomerDto);
      return { data, message: 'created successfully ' };
    } catch (error) {
      throw error;
    }
  }

  @Patch('customer/:id')
  @ApiOperation({ summary: 'Update a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'The customer has been updated',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Response<Customer>> {
    try {
      const data = await this.customerService.update(id, updateCustomerDto);
      return { data, message: 'updated successfully ' };
    } catch (error) {
      throw error;
    }
  }

  @Delete('customer/:id')
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'The customer has been deleted',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async remove(@Param('id') id: string): Promise<Customer> {
    try {
      return await this.customerService.remove(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('projects/:customerId')
  async getAppliedProjects(@Param('customerId') customerId: string) {
    try {
      const data = await this.customerService.getAppliedProjects(customerId);
      return { data, message: 'retrieved successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('customer-profile')
  @ApiOperation({ summary: 'Get the authenticated customer profile' })
  @ApiResponse({ status: 200, description: 'The customer', type: Customer })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @UseGuards(AuthGuard('jwt'))
  async findCustomerProfile(@Req() req: any): Promise<Response<Customer>> {
    try {
      const id = req.user._id; // Assuming the ID is available in the JWT payload
      const data = await this.customerService.findOne(id);
      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('by-agent')
  @ApiOperation({
    summary: 'Get customers by assigned agent ID with pagination',
    description:
      'Retrieve paginated list of customers assigned to a specific agent',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number (default: 1)',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page (default: 10)',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of customers assigned to the agent',
    schema: {
      type: 'object',
      properties: {
        customers: {
          type: 'array',
          items: { $ref: '#/components/schemas/Customer' },
        },
        total: {
          type: 'number',
          description: 'Total number of customers for this agent',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No customers found for this agent',
  })
  @UseGuards(AuthGuard('jwt'))
  async getCustomersByAgentWithPagination(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Response<{ customers: Customer[]; total: number }>> {
    try {
      const agentId = req.user._id;
      const data = await this.customerService.getCustomersByAgentWithPagination(
        agentId,
        page,
        limit,
      );
      return { data, message: 'retrieved successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Post('by-agent')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a customer by agent' })
  @ApiResponse({
    status: 201,
    description: 'Customer created by agent',
    type: Customer,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use',
  })
  async createCustomerByAgent(
    @Req() req: any,
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Response<Customer>> {
    try {
      const agentId = req.user._id;
      const data = await this.customerService.createCustomerByAgent(
        agentId,
        createCustomerDto,
      );
      return { data, message: 'created successfully by agent' };
    } catch (error) {
      throw error;
    }
  }
}
