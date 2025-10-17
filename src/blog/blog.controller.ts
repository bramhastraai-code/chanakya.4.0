import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
  Delete,
  Patch,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';
import { Response } from 'src/common/interceptor/response.interface';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Blog post created successfully',
    type: Blog,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() createBlogDto: CreateBlogDto): Promise<Response<Blog>> {
    try {
      const data = await this.blogService.create(createBlogDto);
      return { data, message: 'create successfully ' };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all blog posts with pagination, sorting, and search',
  })
  @ApiQuery({ name: 'pageSize', type: Number, required: true })
  @ApiQuery({ name: 'pageNumber', type: Number, required: true })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    enum: ['createdAt', 'updatedAt', 'title'],
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
    description: 'Search term for filtering blog posts by title or content',
  })
  @ApiOkResponse({
    description: 'List of blog posts retrieved successfully',
    type: [Blog],
  })
  @ApiNotFoundResponse({ description: 'No blog posts found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchQuery') searchQuery?: string,
  ): Promise<
    Response<{
      blogs: Blog[];
      totalPages: number;
      totalBlogs: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.blogService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
      );
      if (!data.blogs || data.blogs.length === 0) {
        throw new NotFoundException('No blog posts found');
      }

      return { data, message: 'strive successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving blog posts.',
      );
    }
  }

  @Get('blog/:id')
  @ApiOperation({ summary: 'Retrieve a single blog post by ID' })
  @ApiOkResponse({
    description: 'Blog post retrieved successfully',
    type: Blog,
  })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findOne(@Param('id') id: string): Promise<Response<Blog>> {
    try {
      const blog = await this.blogService.findOne(id);
      if (!blog) {
        throw new NotFoundException('Blog post not found');
      }
      return { data: blog, message: 'retrieve successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the blog post.',
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a blog post by ID' })
  @ApiOkResponse({
    description: 'Blog post updated successfully',
    type: Blog,
  })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<Response<Blog>> {
    try {
      const updatedBlog = await this.blogService.update(id, updateBlogDto);
      return { data: updatedBlog, message: 'update successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while updating the blog post.',
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post by ID' })
  @ApiOkResponse({
    description: 'Blog post deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async remove(@Param('id') id: string): Promise<Response<void>> {
    try {
      await this.blogService.remove(id);
      return { data: null, message: 'delete successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while deleting the blog post.',
      );
    }
  }
  //web_____-------------------//web_____-------------------//web_____-------------------//web_____-------------------
  @Get('active')
  @ApiOperation({
    summary:
      'Retrieve all active blog posts with pagination, sorting, and search',
  })
  @ApiQuery({ name: 'pageSize', type: Number, required: true })
  @ApiQuery({ name: 'pageNumber', type: Number, required: true })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    enum: ['createdAt', 'updatedAt', 'title'],
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
    description:
      'Search term for filtering active blog posts by title or content',
  })
  @ApiOkResponse({
    description: 'List of active blog posts retrieved successfully',
    type: [Blog],
  })
  @ApiNotFoundResponse({ description: 'No active blog posts found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findActiveBlogs(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchQuery') searchQuery?: string,
  ): Promise<
    Response<{
      blogs: Blog[];
      totalPages: number;
      totalBlogs: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.blogService.findActiveBlogs(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
      );
      console.log(pageSize, pageNumber, sortBy, sortOrder, searchQuery, data);

      if (!data.blogs || data.blogs.length === 0) {
        throw new NotFoundException('No active blog posts found');
      }

      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('active/:id')
  @ApiOperation({ summary: 'Retrieve a single active blog post by ID' })
  @ApiOkResponse({
    description: 'Active blog post retrieved successfully',
    type: Blog,
  })
  @ApiNotFoundResponse({ description: 'Active blog post not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findOneActive(@Param('id') id: string): Promise<Response<Blog>> {
    try {
      const blog = await this.blogService.findOneActive(id);
      if (!blog) {
        throw new NotFoundException('Active blog post not found');
      }
      return { data: blog, message: 'retrieve successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the active blog post.',
      );
    }
  }
}
