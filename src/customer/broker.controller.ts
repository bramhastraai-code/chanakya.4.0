import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
  // ApiBearerAuth,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { BrokerResponseDto } from './dto/broker-response.dto';
import { BrokerService } from './broker.service';
import { Response } from 'src/common/interceptor/response.interface';
import { Customer } from './entities/customer.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateLeadStatusDto } from './dto/update-lead.status.tdo';
import { HandleBrokerConnectionDto } from './dto/handleConnection.dto';
// import { AuthGuard } from '@nestjs/passport';

@ApiTags('Brokers')
@Controller('brokers')
@ApiExtraModels(BrokerResponseDto)
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get('/brokers-with-performance')
  @ApiOperation({
    summary: 'Get all brokers with performance metrics',
    description: `
      Returns all registered agents/brokers with their complete profile information
      and calculated performance scores. The performance score is calculated based on:
      - Rating (40% weight)
      - Closed deals (30% weight)
      - Review count (20% weight)
      - Years of experience (10% weight)
      
      Includes all agent-specific properties:
      - Contact information
      - Service areas
      - Verification status
      - License details
      - Agency information (if applicable)
      - Performance metrics
    `,
  })
  @ApiOkResponse({
    description: 'Successfully retrieved list of brokers with performance data',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(BrokerResponseDto),
      },
      example: [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'John Doe',
          userImage: 'https://example.com/profile.jpg',
          email: 'john.doe@example.com',
          userType: 'Agent',
          responseTime: '1 day',
          serviceAreas: ['New York', 'Boston'],
          verificationStatus: 'Verified',
          verificationDocuments: ['doc1.pdf', 'doc2.pdf'],
          licenseNumber: 'LIC123456',
          licenseExpiry: '2025-12-31T00:00:00.000Z',
          yearsOfExperience: 5,
          agencyName: 'Prime Real Estate',
          agencyLicense: 'AGENCY123',
          agencyFoundedYear: 2010,
          teamSize: 10,
          rating: 4.5,
          reviewCount: 25,
          closedDeals: 50,
          performanceScore: 4.25,
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getBrokersWithPerformance(): Promise<Response<BrokerResponseDto[]>> {
    const data = await this.brokerService.getAllBrokersWithPerformance();
    return { data, message: 'Brokers fetched successfully' };
  }

  @Get('by-service-area')
  @ApiOperation({ summary: 'Get customers by service area' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getByServiceArea(
    @Query('area') area: string,
  ): Promise<Response<Customer[]>> {
    const data = await this.brokerService.findByServiceArea(area);
    return { data, message: 'Customers fetched successfully' };
  }

  @Get('by-service-areas')
  @ApiOperation({ summary: 'Get customers by multiple service areas' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getByServiceAreas(
    @Query('areas') areas: string,
  ): Promise<Response<Customer[]>> {
    const areasArray = areas.split(',');
    const data = await this.brokerService.findByServiceAreas(areasArray);
    return { data, message: 'Customers fetched successfully' };
  }

  @Get('by-assigned-agent')
  @ApiOperation({ summary: 'Get customers assigned to a specific agent' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async findByAssignedAgent(@Req() req: any): Promise<Response<Customer[]>> {
    try {
      const id = req.user._id; // Assuming the user ID is in the JWT payload
      // const id = '68111f882448bc3256d8d52d';
      const data = await this.brokerService.findByAssignedAgent(id);
      return { data, message: 'Customers fetched successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Post('request/:brokerId')
  @ApiOperation({ summary: 'Request connection with a specific broker' })
  @ApiResponse({ status: 200, description: 'Request initiated successfully' })
  @ApiBody({
    description: 'Request payload containing customer ID and area',
    schema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        area: { type: 'string', example: 'New York' },
      },
      required: ['customerId', 'area'],
    },
  })
  async requestBroker(
    @Body() body: { customerId: string; area: string },
    @Param('brokerId') brokerId: string,
  ) {
    const data = await this.brokerService.handleBrokerRequest(
      body.customerId,
      brokerId,
      body.area,
    );
    return { data, message: 'Request sent successfully' };
  }

  @Post('accept/:customerId')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Broker accepts a customer request' })
  @ApiResponse({ status: 200, description: 'Broker assigned successfully' })
  async acceptRequest(
    @Param('customerId') customerId: string,
    @Body() body: { brokerId: string },
  ) {
    const data = await this.brokerService.acceptRequest(
      body.brokerId,
      customerId,
    );
    return { data, message: 'Request accepted successfully' };
  }

  @Post('manual-assign/:customerId')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin manually assigns a broker' })
  @ApiResponse({ status: 200, description: 'Broker manually assigned' })
  async manualAssign(
    @Param('customerId') customerId: string,
    @Body() body: { brokerId: string; adminId: string },
  ) {
    const data = await this.brokerService.manuallyAssignBroker(
      body.adminId,
      customerId,
      body.brokerId,
    );
    return { data, message: 'Broker manually assigned' };
  }

  /**
   * update broker using jwt token
   */
  @Patch('update-broker')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'The customer has been updated',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async update(
    @Req() req: any,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Response<Customer>> {
    const id = req.user._id;
    const data = await this.brokerService.updateBroker(id, updateCustomerDto);
    return { data, message: 'Customer updated successfully' };
  }

  @Get('get-broker')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get broker by ID' })
  @ApiResponse({
    status: 200,
    description: 'Broker retrieved successfully',
    type: Customer,
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'Broker not found' })
  async getBrokerById(@Req() req: any): Promise<Response<Customer>> {
    try {
      const id = req.user._id;
      const broker = await this.brokerService.getBrokerById(id);
      return { data: broker, message: 'Broker retrieved successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update lead status',
    description: 'Update the status of a lead/customer',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the customer/lead to update',
    type: String,
  })
  @ApiBody({ type: UpdateLeadStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Lead status updated successfully',
    type: Customer,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User not authorized to update this lead',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead not found',
  })
  async updateLeadStatus(
    @Param('id') customerId: string,
    @Body() updateLeadStatusDto: UpdateLeadStatusDto,
    @Req() req,
  ): Promise<Response<Customer>> {
    // The JWT guard ensures the user is authenticated
    // req.user contains the payload from the JWT token
    const updatedBy = req.user._id; // Assuming the user ID is in the JWT payload
    // const updatedBy = '68111f882448bc3256d8d52d';
    // Optional: Add authorization check here
    // For example, verify the user is the assigned agent or has proper role

    const data = await this.brokerService.updateLeadStatus(
      customerId,
      updateLeadStatusDto,
      updatedBy,
    );
    return { data, message: 'Lead status updated successfully' };
  }

  @Post('request-connection/:brokerId')
  @ApiOperation({
    summary: 'Send connection request to broker',
    description: 'Allows a customer to send a connection request to a broker',
  })
  @ApiParam({
    name: 'brokerId',
    description: 'ID of the broker receiving the request',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Connection request sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 404, description: 'Customer or broker not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseGuards(AuthGuard('jwt'))
  async sendBrokerConnectionRequest(
    @Req() req: any,
    @Param('brokerId') brokerId: string,
  ) {
    const customerId = req.user._id; // Assuming the user ID is in the JWT payload
    const data = await this.brokerService.sendBrokerConnectionRequest(
      customerId,
      brokerId,
    );
    return { data, message: 'Connection request sent successfully' };
  }

  // send request
  @Post(':customerId/handle-connection')
  @ApiOperation({
    summary: 'Handle broker connection request',
    description: 'Allows broker to accept or reject a connection request',
  })
  @ApiParam({
    name: 'customerId',
    description: 'ID of the customer who sent the request',
    type: String,
  })
  @ApiBody({ type: HandleBrokerConnectionDto })
  @ApiResponse({
    status: 200,
    description: 'Connection request handled successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({
    status: 409,
    description: 'Customer already connected with another broker',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseGuards(AuthGuard('jwt'))
  async handleBrokerConnectionRequest(
    @Param('customerId') customerId: string,
    @Req() req: any,
    @Body() handleConnectionDto: HandleBrokerConnectionDto,
  ) {
    const brokerId = req.user._id; // Assuming the user ID is in the JWT payload
    const data = await this.brokerService.handleBrokerConnectionRequest(
      customerId,
      brokerId,
      handleConnectionDto.action,
      handleConnectionDto.brokerName,
    );
    return { data, message: 'Connection request handled successfully' };
  }

  @Post('request-test/:brokerId/:customerId')
  @ApiOperation({
    summary: 'Send connection request to broker',
    description: 'Allows a customer to send a connection request to a broker',
  })
  @ApiParam({
    name: 'brokerId',
    description: 'ID of the broker receiving the request',
    type: String,
  })
  @ApiParam({
    name: 'customerId',
    description: 'ID of the broker receiving the request',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Connection request sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 404, description: 'Customer or broker not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async sendBrokerConnectionRequesTestt(
    @Param('customerId') customerId: string,
    @Param('brokerId') brokerId: string,
  ) {
    const data = await this.brokerService.sendBrokerConnectionRequest(
      customerId,
      brokerId,
    );
    return { data, message: 'Connection request sent successfully' };
  }
}
