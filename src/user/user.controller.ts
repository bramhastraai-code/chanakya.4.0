import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
  Query,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { Status } from 'src/common/enum/status.enum';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users with pagination, sorting, and search',
  })
  @ApiQuery({ name: 'pageSize', type: Number, required: true })
  @ApiQuery({ name: 'pageNumber', type: Number, required: true })
  @ApiQuery({ name: 'status', type: String, required: false })
  @ApiQuery({ name: 'role', type: Types.ObjectId, required: false })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    enum: ['name'],
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
    description: 'Search term for filtering users by name or email',
  })
  @ApiOkResponse({
    description: 'List of users retrieved successfully',
    type: User,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'No users found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchQuery') searchQuery?: string,
    @Query('role') role?: Types.ObjectId | 'all',
    @Query('status') status?: Status,
  ): Promise<
    Response<{
      users: User[];
      totalPages: number;
      totalUsers: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.userService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
        role,
        status,
      );

      return { data: data, message: 'Successfully retrieved users' };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User details', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<Response<User>> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { data: user, message: 'Successfully retrieved user' };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @UseInterceptors(FileInterceptor('userImage'))
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    try {
      const data = await this.userService.create(createUserDto);
      return { data, message: 'User created successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseInterceptors(FileInterceptor('userImage'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Response<User>> {
    try {
      const data = await this.userService.update(id, updateUserDto);
      return { data, message: 'User updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<Response<any>> {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userService.remove(id);
      return { data: {}, message: 'successfully deleted user' };
    } catch (error) {
      throw error;
    }
  }
}
