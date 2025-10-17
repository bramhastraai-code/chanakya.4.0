// src/orders/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of orders' })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of orders per page',
    required: true,
    example: '10',
  })
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number to fetch',
    required: true,
    example: '1',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Field to sort by (default: createdAt)',
    required: false,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort order (asc or desc)',
    required: false,
    example: 'asc',
  })
  @ApiQuery({
    name: 'searchQuery',
    description: 'Search query to filter orders by userId, receipt, or orderId',
    required: false,
    example: 'receipt_12345',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter orders by status (pending, success, failed)',
    required: false,
    example: 'pending',
  })
  async getOrders(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc',
    @Query('searchQuery') searchQuery?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.orderService.findAll(
      pageSize,
      pageNumber,
      sortBy,
      sortOrder,
      searchQuery,
      status,
    );
    return { data, message: 'orders fetched successfully' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 200, description: 'The order details', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(
    @Param('id') id: string,
  ): Promise<{ data: Order; message: string }> {
    try {
      const order = await this.orderService.findOne(id);
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found.`);
      }
      return { data: order, message: 'Order retrieved successfully' };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const { userId, amount, planId } = createOrderDto;
    const data = await this.orderService.createOrder(userId, amount, planId);

    return { data, message: 'order created successfully' };
  }

  @ApiOperation({ summary: 'Update the status of an order' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    const { status, paymentDetails } = updateStatusDto;
    const data = await this.orderService.updateOrderStatus(
      orderId,
      status,
      paymentDetails,
    );
    return { data, message: 'order status updated successfully' };
  }

  @ApiOperation({ summary: 'Get all orders of a user' })
  @ApiResponse({ status: 200, description: 'Orders fetched successfully.' })
  @ApiResponse({
    status: 404,
    description: 'User not found or no orders available.',
  })
  @Get(':userId')
  async getUserOrders(@Param('userId') userId: string) {
    const data = await this.orderService.getUserOrders(userId);
    return { data, message: 'order fetch successfully ' };
  }
}
