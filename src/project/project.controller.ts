import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  InternalServerErrorException,
  Patch,
  NotFoundException,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { ProjectAffordability, ProjectCategory } from './enum/project.enum';
import {
  GetProjectByAffordabilityDto,
  GetProjectByCategoryDto,
} from './dto/ProjectCategory.dto';
import { FeaturedProjectDto } from './dto/featuredProject.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDetailDto } from './dto/project-detail.dto';
import { Status } from 'src/common/enum/status.enum';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The project has been successfully created.',
    type: Project,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Response<Project>> {
    const data = await this.projectService.create(createProjectDto);
    return { data, message: 'created successfully' };
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all projects with pagination, sorting, and searching',
  })
  @ApiQuery({
    name: 'pageSize',
    required: true,
    type: String,
    description: 'Number of projects per page',
  })
  @ApiQuery({
    name: 'pageNumber',
    required: true,
    type: String,
    description: 'Current page number',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Sort order',
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'searchQuery',
    required: false,
    type: String,
    description: 'Search query for filtering projects',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The list of projects with pagination, sorting, and searching',
    schema: {
      example: {
        properties: [
          {
            id: '60d0fe4f5311236168a109ca',
            projectName: 'Project A',
            projectThumbnail: 'http://example.com/thumbnail.jpg',
            createdAt: '2024-08-26T12:00:00Z',
            updatedAt: '2024-08-26T12:00:00Z',
          },
          // more project examples
        ],
        totalPages: 10,
        totalProjects: 100,
        pageSize: 10,
        pageNumber: 1,
      },
    },
  })
  async findAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchQuery') searchQuery?: string,
    @Query('status') status?: Status,
  ): Promise<
    Response<{
      projects: Project[];
      totalPages: number;
      totalProjects: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.projectService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
        status,
      );
      return { data, message: 'project retrive sucessfullly' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving projects.',
      );
    }
  }

  @Get('project/:id')
  @ApiOperation({ summary: 'Retrieve a single project by ID' })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '60d0fe4f5311236168a109ca',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The project found',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  async findOne(@Param('id') id: string): Promise<Response<Project>> {
    return {
      data: await this.projectService.findOne(id),
      message: 'retrieve successfully',
    };
  }

  @Patch('project/:id')
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '60d0fe4f5311236168a109ca',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The project has been successfully updated',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Response<Project>> {
    const data = await this.projectService.update(id, updateProjectDto);
    return { data, message: 'updated successfully' };
  }

  @Delete('project/:id')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '60d0fe4f5311236168a109ca',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The project has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<Response<Project>> {
    const data = await this.projectService.remove(id);
    return { data, message: 'delete successfully' };
  }

  @Get('project-list')
  @ApiOperation({
    summary: 'Retrieve all builders ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of builders retrieved successfully',
    type: [Project],
  })
  @ApiNotFoundResponse({ description: 'No Project found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async projectList(): Promise<Response<{ value: string; label: string }[]>> {
    try {
      const data = await this.projectService.ProjectList();
      if (!data || data.length === 0) {
        throw new NotFoundException('No builders found');
      }

      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }
  //website endpoints-------------------------------------------------------------------------------------
  @Get('by-category')
  @ApiOperation({ summary: 'Get projects by category' })
  @ApiQuery({ name: 'category', enum: ProjectCategory, required: false })
  @ApiResponse({
    status: 200,
    description: 'List of active projects.',
    type: [FeaturedProjectDto], // Specify the response type for Swagger
  })
  async getProjectsByCategory(
    @Query() getProjectByCategoryDto: GetProjectByCategoryDto,
  ): Promise<Response<FeaturedProjectDto[]>> {
    const { category } = getProjectByCategoryDto;
    const data = await this.projectService.getProjectsByCategory(category);
    return { data, message: 'retrieve successfully' };
  }

  @Get('by-affordability')
  @ApiOperation({ summary: 'Get projects by category' })
  @ApiQuery({
    name: 'affordability',
    enum: ProjectAffordability,
    required: false,
  })
  @ApiQuery({
    name: 'city',
    type: String,
    required: false,
    description: 'city name',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active projects.',
    type: [FeaturedProjectDto], // Specify the response type for Swagger
  })
  async getProjectsByAffordability(
    @Query() getProjectByAffordabilityDto: GetProjectByAffordabilityDto,
  ): Promise<Response<FeaturedProjectDto[]>> {
    const { affordability, city } = getProjectByAffordabilityDto;
    console.log(affordability);

    const data = await this.projectService.getProjectsByAffordability(
      affordability,
      city,
    );
    console.log(data);

    return { data, message: 'retrieve successfully' };
  }

  @Get('project-detail/:id')
  @ApiOperation({ summary: 'Get project details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of the project',
    type: ProjectDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async getProjectDetail(
    @Param('id') id: string,
  ): Promise<Response<ProjectDetailDto>> {
    const data = await this.projectService.getProjectDetail(id);
    return { data, message: 'retrieve successfully' };
  }

  @Get('by-city/:city')
  @ApiOperation({ summary: 'Get projects by city' })
  @ApiParam({
    name: 'city',
    required: true,
    description: 'Name of the city to filter projects by',
    example: 'Mumbai',
  })
  @ApiResponse({
    status: 200,
    description: 'List of projects in the specified city',
    type: [Project], // Swagger uses this to display the type of the response
  })
  @ApiResponse({
    status: 404,
    description: 'No projects found in the specified city',
  })
  async getProjectsByCity(@Param('city') city: string) {
    const data = await this.projectService.getProjectsByCity(city);
    return { data, message: 'retrieve successfully' };
  }

  @Get('project-region-wise')
  @ApiOperation({ summary: 'Get projects grouped by city and region' })
  @ApiResponse({
    status: 200,
    description: 'Returns projects grouped by city and region',
    type: [Object],
  })
  async getFormattedProjects() {
    const data = await this.projectService.getFormattedProjects();
    return { data, message: 'retrieved successfully' };
  }

  @Get('unique-cities')
  @ApiOperation({ summary: 'Get unique cities' })
  @ApiResponse({
    status: 200,
    description: 'List of unique cities',
    type: [String],
  })
  async getUniqueCities(): Promise<Response<string[]>> {
    try {
      const data = await this.projectService.getUniqueCities();
      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Get('project-count-by-city')
  @ApiOperation({ summary: 'Get property count by city' })
  @ApiResponse({
    status: 200,
    description: 'The property count by city has been successfully retrieved.',
    schema: {
      example: [
        { city: 'Mumbai', propertyCount: 120 },
        { city: 'Delhi', propertyCount: 95 },
        { city: 'Bangalore', propertyCount: 75 },
      ],
    },
  })
  async getCityPropertyCount() {
    const data = await this.projectService.getCityPropertyCount();
    return { data, message: 'retried successfully' };
  }

  @Get('builder/:builderId')
  async getProjectsByBuilder(@Param('builderId') builderId: string) {
    return this.projectService.getProjectsByBuilder(builderId);
  }
  @Get('grouped-by-builder')
  async getProjectsGroupedByBuilder() {
    return this.projectService.getProjectsGroupedByBuilder();
  }

  @Get('get-project-suggestions')
  @ApiOperation({
    summary: 'Search projects by keyword',
    description: 'Search for projects and return their title and id.',
  })
  @ApiQuery({ name: 'keyword', required: true, description: 'Search keyword' })
  async searchProjects(@Query('keyword') keyword: string) {
    if (!keyword || keyword.trim() === '') {
      throw new HttpException('Keyword is required', HttpStatus.BAD_REQUEST);
    }

    const data = await this.projectService.searchProjects(keyword);
    return { data, message: 'retrieved successfully' };
  }

  @Post('builder-projects')
  @UseGuards(AuthGuard('builder-jwt'))
  @ApiOperation({ summary: 'Create a new project (builder endpoint)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The project has been successfully created.',
    type: Project,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async createBuilderProject(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Response<Project>> {
    const data = await this.projectService.create(createProjectDto);
    return { data, message: 'Project created successfully' };
  }

  /**
   * Get projects by builder ID
   * @param builderId The ID of the builder to filter projects by
   * @returns A list of projects associated with the specified builder
   */
  @Get('builder-projects/:builderId')
  @ApiOperation({ summary: 'Get projects by builder ID' })
  @ApiParam({
    name: 'builderId',
    required: true,
    description: 'ID of the builder to filter projects by',
    example: '60d0fe4f5311236168a109ca',
  })
  @ApiResponse({
    status: 200,
    description: 'List of projects for the specified builder',
    type: [Project],
  })
  @ApiNotFoundResponse({
    description: 'No projects found for the specified builder',
  })
  async getProjectsByBuilderId(
    @Param('builderId') builderId: string,
  ): Promise<Response<Project[]>> {
    try {
      const data = await this.projectService.getBuilderProjects(builderId);
      return { data, message: 'retrieve successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a project by projectId
   * @param projectId The ID of the project to update
   * @param updateProjectDto The data to update the project with
   * @returns The updated project
   */
  @Patch('builder-projects/:projectId')
  @UseGuards(AuthGuard('builder-jwt'))
  @ApiOperation({ summary: 'Update a project by projectId' })
  @ApiParam({
    name: 'projectId',
    required: true,
    description: 'ID of the project to update',
    example: '60d0fe4f5311236168a109ca',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The project has been successfully updated',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  async updateProject(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Response<Project>> {
    const data = await this.projectService.update(projectId, updateProjectDto);
    return { data, message: 'Project updated successfully' };
  }

  /**
   * Delete a project by projectId (builder endpoint)
   * @param projectId The ID of the project to delete
   * @returns The deleted project
   */
  @Delete('builder-projects/:projectId')
  @UseGuards(AuthGuard('builder-jwt'))
  @ApiOperation({ summary: 'Delete a project by projectId (builder endpoint)' })
  @ApiParam({
    name: 'projectId',
    required: true,
    description: 'ID of the project to delete',
    example: '60d0fe4f5311236168a109ca',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The project has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProject(
    @Param('projectId') projectId: string,
  ): Promise<Response<Project>> {
    const data = await this.projectService.remove(projectId);
    return { data, message: 'Project deleted successfully' };
  }
}
