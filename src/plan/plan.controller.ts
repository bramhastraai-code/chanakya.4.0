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
import { PlanService } from './plan.service';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Response } from 'src/common/interceptor/response.interface';

@ApiTags('plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Plan created successfully',
    type: Plan,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<Response<Plan>> {
    try {
      const data = await this.planService.create(createPlanDto);
      return { data, message: 'Plan created successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Patch('plan/:id')
  @ApiOperation({ summary: 'Update an existing plan' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plan updated successfully',
    type: Plan,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plan not found',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<Plan> {
    try {
      const updatedPlan = await this.planService.update(id, updatePlanDto);
      if (!updatedPlan) {
        throw new NotFoundException('Plan not found');
      }
      return updatedPlan;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the plan.',
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all plans with pagination, sorting, and search',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: true,
    description: 'Number of plans per page',
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
    enum: ['createdAt', 'updatedAt', 'price'],
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
    description: 'Search term for filtering plans',
  })
  @ApiOkResponse({
    description: 'List of plans retrieved successfully',
    type: [Plan],
  })
  @ApiNotFoundResponse({
    description: 'No plans found',
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
      plans: Plan[];
      totalPages: number;
      totalPlans: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.planService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
      );

      if (!data.plans || data.plans.length === 0) {
        throw new NotFoundException('No plans found');
      }

      return { data, message: 'Retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('plan/:id')
  @ApiOperation({ summary: 'Retrieve a single plan by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The plan details',
    type: Plan,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plan not found',
  })
  async findOne(@Param('id') id: string): Promise<Response<Plan>> {
    try {
      const plan = await this.planService.findOne(id);
      if (!plan) {
        throw new NotFoundException('Plan not found');
      }
      return { data: plan, message: 'Retrieve successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the plan.',
      );
    }
  }

  @Delete('plan/:id')
  @ApiOperation({ summary: 'Delete a plan by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Plan deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plan not found',
  })
  async remove(
    @Param('id') id: string,
  ): Promise<{ data: string; message: string }> {
    try {
      const result = await this.planService.remove(id);
      if (result.deletedCount === 0) {
        throw new NotFoundException('Plan not found');
      }
      return { data: 'DELETE successfully', message: 'delete successful' };
    } catch (error) {
      throw error;
    }
  }

  // for web ----------------------------------------------------------------------------
  @Get('/plan-type')
  @ApiOperation({ summary: 'Get plans by Plan type' })
  @ApiQuery({
    name: 'planType',
    required: true,
    type: String,
    description: 'The product type to filter by',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plans fetched successfully',
    type: [Plan],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No plans found',
  })
  async findPlansByProductTypeAndStatus(
    @Query('planType') planType: string,
  ): Promise<Response<Plan[]>> {
    try {
      const data = await this.planService.findByProductTypeAndStatus(planType);
      return { data, message: 'Plans fetched successfully' };
    } catch (error) {
      throw new NotFoundException('No plans found matching the criteria');
    }
  }
}
