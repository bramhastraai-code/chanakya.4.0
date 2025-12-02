import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Status } from 'src/common/enum/status.enum';
import { Response } from 'src/common/interceptor/response.interface';
import { ProjectService } from 'src/project/project.service';
import { BuilderService } from './builder.service';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { UpdateBuilderDto } from './dto/update-builder.dto';
import { Builder } from './entities/builder.entity';
@ApiTags('Builders')
@Controller('builders')
export class BuilderController {
  constructor(
    private readonly builderService: BuilderService,
    private projectService: ProjectService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new builder' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Builder created successfully',
    type: Builder,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(
    @Body() createBuilderDto: CreateBuilderDto,
  ): Promise<Response<Builder>> {
    try {
      const data = await this.builderService.create(createBuilderDto);
      return { data, message: 'created successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary:
      'Retrieve all builders with optional search, pagination, and sorting',
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
    description: 'Search term for filtering builders by name or email',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of builders retrieved successfully',
    type: [Builder],
  })
  @ApiNotFoundResponse({ description: 'No builders found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll(
    @Query('pageSize') pageSize?: string,
    @Query('pageNumber') pageNumber?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchQuery') searchQuery?: string,
    @Query('status') status?: Status,
  ): Promise<
    Response<{
      builders: Builder[];
      totalPages: number;
      totalBuilders: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.builderService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
        status,
      );
      if (!data.builders || data.builders.length === 0) {
        throw new NotFoundException('No builders found');
      }

      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving builders.',
      );
    }
  }

  @Get('by-owner')
  @UseGuards(AuthGuard('builder-jwt'))
  @ApiOperation({ summary: 'Retrieve builders by owner ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Builders retrieved successfully',
    type: [Builder],
  })
  @ApiNotFoundResponse({ description: 'No builders found for this owner' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findByOwnerId(@Req() req: any): Promise<Response<Builder[]>> {
    try {
      const ownerId = req.user._id;
      // const ownerId = '67f51606ccc29f25b46e8a4a';
      const builders = await this.builderService.findByOwnerId(ownerId);
      if (!builders || builders.length === 0) {
        throw new NotFoundException(
          `No builders found for owner ID ${ownerId}`,
        );
      }
      return { data: builders, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('builder/:id')
  @ApiOperation({ summary: 'Retrieve a builder by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Builder retrieved successfully',
    type: Builder,
  })
  @ApiQuery({
    name: 'id',
    type: String,
    required: true,
    description: 'Builder ID',
  })
  @ApiNotFoundResponse({ description: 'Builder not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findOne(@Param('id') id: string): Promise<Response<Builder>> {
    try {
      const builder = await this.builderService.findOne(id);
      if (!builder) {
        throw new NotFoundException(`Builder with ID ${id} not found`);
      }
      return { data: builder, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Patch('builder/:id')
  @ApiOperation({ summary: 'Update a builder by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Builder updated successfully',
    type: Builder,
  })
  @ApiNotFoundResponse({ description: 'Builder not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @Body() updateBuilderDto: UpdateBuilderDto,
  ): Promise<Response<Builder>> {
    try {
      const updatedBuilder = await this.builderService.update(
        id,
        updateBuilderDto,
      );
      if (!updatedBuilder) {
        throw new NotFoundException(`Builder with ID ${id} not found`);
      }
      return { data: updatedBuilder, message: 'updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Delete('builder/:id')
  @ApiOperation({ summary: 'Delete a builder by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Builder deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Builder not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const deleted = await this.builderService.remove(id);
      if (!deleted) {
        throw new NotFoundException(`Builder with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the builder.',
      );
    }
  }

  @Get('builder-list')
  @ApiOperation({
    summary: 'Retrieve all builders ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of builders retrieved successfully',
    type: [Builder],
  })
  @ApiNotFoundResponse({ description: 'No builders found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async builderList() {
    try {
      const data = await this.builderService.BuilderList();
      if (!data || data.length === 0) {
        throw new NotFoundException('No builders found');
      }

      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('with-projects')
  async getBuildersWithProjects() {
    try {
      const data = await this.builderService.getBuildersWithProjectCount();
      return { data, message: 'retrieved succeessfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('builder-web/:id')
  @ApiOperation({ summary: 'Retrieve a builder by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Builder retrieved successfully',
    type: Builder,
  })
  @ApiNotFoundResponse({ description: 'Builder not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getBuilder(@Param('id') id: string) {
    try {
      const builder = await this.builderService.findOne(id);
      if (!builder) {
        throw new NotFoundException(`Builder with ID ${id} not found`);
      }

      const projects = await this.projectService.getProjectsByBuilder(id);
      return {
        data: { builder, projects: projects.data },
        message: 'retrieve successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new builder (builder-specific endpoint)
   * @param createBuilderDto The data for the new builder
   * @returns The created builder
   */
  // @Post('builder-by-owner')
  // @UseGuards(AuthGuard('builder-jwt'))
  // @ApiOperation({ summary: 'Create a new builder for the authenticated owner' })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'The builder has been successfully created.',
  //   type: Builder,
  // })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  // async createBuilderByOwner(
  //   @Req() req: any,
  //   @Body() createBuilderDto: CreateBuilderDto,
  // ): Promise<Response<Builder>> {
  //   const ownerId = req.user._id;
  //   createBuilderDto.owner = ownerId;
  //   const data = await this.builderService.create(createBuilderDto);
  //   return { data, message: 'Builder created successfully' };
  // }

  /**
   * Get builders by owner ID (builder-specific endpoint)
   * @returns A list of builders associated with the authenticated owner
   */
  // @Get('builder-by-owner')
  // @UseGuards(AuthGuard('builder-jwt'))
  // @ApiOperation({ summary: 'Get builders by owner ID (authenticated user)' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'List of builders for the authenticated owner',
  //   type: [Builder],
  // })
  // @ApiNotFoundResponse({
  //   description: 'No builders found for the authenticated owner',
  // })
  // async getBuildersByOwnerId(@Req() req: any): Promise<Response<Builder[]>> {
  //   const ownerId = req.user._id;
  //   // const ownerId = '67f51606ccc29f25b46e8a4a';
  //   const data = await this.builderService.findByOwnerId(ownerId);
  //   if (!data || data.length === 0) {
  //     throw new NotFoundException(`No builders found for owner ID ${ownerId}`);
  //   }
  //   return { data, message: 'Builders retrieved successfully' };
  // }

  /**
   * Update a builder by builderId (builder-specific endpoint)
   * @param builderId The ID of the builder to update
   * @param updateBuilderDto The data to update the builder with
   * @returns The updated builder
   */
  @Patch('update-builder')
  @UseGuards(AuthGuard('builder-jwt'))
  @ApiOperation({ summary: 'Update a builder by builderId (owner only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The builder has been successfully updated',
    type: Builder,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Builder not found',
  })
  async updateBuilder(
    @Req() req: any,
    @Body() updateBuilderDto: UpdateBuilderDto,
  ): Promise<Response<Builder>> {
    const builderId = req.user._id;
    const data = await this.builderService.update(builderId, updateBuilderDto);
    if (!data) {
      throw new NotFoundException(`Builder with ID ${builderId} not found`);
    }
    return { data, message: 'Builder updated successfully' };
  }

  /**
   * Delete a builder by builderId (builder-specific endpoint)
   * @param builderId The ID of the builder to delete
   * @returns Success message
   */
  // @Delete('builder-by-owner/:builderId')
  // @UseGuards(AuthGuard('builder-jwt'))
  // @ApiOperation({ summary: 'Delete a builder by builderId (owner only)' })
  // @ApiParam({
  //   name: 'builderId',
  //   required: true,
  //   description: 'ID of the builder to delete',
  //   example: '60d0fe4f5311236168a109ca',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'The builder has been successfully deleted',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Builder not found',
  // })
  // async deleteBuilderByOwner(
  //   @Param('builderId') builderId: string,
  // ): Promise<Response<null>> {
  //   const deleted = await this.builderService.remove(builderId);
  //   if (!deleted) {
  //     throw new NotFoundException(`Builder with ID ${builderId} not found`);
  //   }
  //   return { data: null, message: 'Builder deleted successfully' };
  // }

  @Get('builder-profile')
  @ApiOperation({ summary: 'Retrieve a builder by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Builder retrieved successfully',
    type: Builder,
  })
  @UseGuards(AuthGuard('builder-jwt'))
  @ApiNotFoundResponse({ description: 'Builder not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findOneBuilder(@Req() req: any): Promise<Response<Builder>> {
    try {
      const id = req.user._id;
      // const id = '68617059e317903e3e921e64'; // Get the builder ID from the authenticated user
      const builder = await this.builderService.findOne(id);
      if (!builder) {
        throw new NotFoundException(`Builder with ID ${id} not found`);
      }
      return { data: builder, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }
}
