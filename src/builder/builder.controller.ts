import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BuilderService } from './builder.service';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { UpdateBuilderDto } from './dto/update-builder.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { S3Service } from 'src/s3/s3.service';

@ApiTags('Builder')
@ApiBearerAuth()
@Controller('builder')
@UseGuards(jwtGuard, RolesGuard)
export class BuilderController {
  constructor(
    private readonly builderService: BuilderService,
    private readonly s3Service: S3Service,
  ) {}

  @Get('profile')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ summary: 'Get builder profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.builderService.getProfile(user.userId);
    return { data, message: 'Profile retrieved successfully' };
  }

  @Put('profile')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ summary: 'Update builder profile' })
  async updateProfile(@CurrentUser() user: any, @Body() dto: any) {
    const data = await this.builderService.updateProfile(user.userId, dto);
    return { data, message: 'Profile updated successfully' };
  }

  @Put('profile/social-links')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ summary: 'Update social media links' })
  async updateSocialLinks(@CurrentUser() user: any, @Body() dto: any) {
    const data = await this.builderService.updateSocialLinks(user.userId, dto);
    return { data, message: 'Social links updated successfully' };
  }

  @Post('profile/logo')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ summary: 'Upload company logo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageResult = await this.s3Service.uploadFile(file, 'builder-logos');
    const data = await this.builderService.updateCompanyLogo(
      user.userId,
      imageResult.url,
    );
    return { data, message: 'Logo uploaded successfully' };
  }

  @Get('profile/statistics')
  @Roles(UserRole.BUILDER)
  @ApiOperation({ summary: 'Get builder statistics' })
  async getStatistics(@CurrentUser() user: any) {
    const data = await this.builderService.getStatistics(user.userId);
    return { data, message: 'Statistics retrieved successfully' };
  }
}

// Admin endpoints
@ApiTags('Builder by Admin')
@ApiBearerAuth()
@Controller('builder-by-admin')
@UseGuards(jwtGuard, RolesGuard)
export class BuilderAdminController {
  constructor(private readonly builderService: BuilderService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new builder' })
  @ApiResponse({ status: 201, description: 'Builder created successfully' })
  create(@Body() createBuilderDto: CreateBuilderDto) {
    return this.builderService.create(createBuilderDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all builders with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('isActive') isActive?: boolean,
  ) {
    return this.builderService.findAll(
      page,
      limit,
      search,
      sort,
      order,
      isActive !== undefined ? { isActive } : undefined,
    );
  }

  @Get('builder/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a builder by ID' })
  findOne(@Param('id') id: string) {
    return this.builderService.findOne(id);
  }

  @Patch('builder/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a builder' })
  update(@Param('id') id: string, @Body() updateBuilderDto: UpdateBuilderDto) {
    return this.builderService.update(id, updateBuilderDto);
  }

  @Delete('builder/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a builder' })
  remove(@Param('id') id: string) {
    return this.builderService.remove(id);
  }

  @Get('builder/:id/properties')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all properties by builder ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getBuilderProperties(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.builderService.getBuilderProperties(
      id,
      page,
      limit,
    );
    return {
      data,
      message: 'Builder properties retrieved successfully',
    };
  }

  @Get('builder/:id/projects')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all projects by builder ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getBuilderProjects(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.builderService.getBuilderProjects(id, page, limit);
    return {
      data,
      message: 'Builder projects retrieved successfully',
    };
  }

  @Get('builder/:id/inquiries')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all inquiries for builder properties/projects',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getBuilderInquiries(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.builderService.getBuilderInquiries(id, page, limit);
    return {
      data,
      message: 'Builder inquiries retrieved successfully',
    };
  }

  @Get('builder/:id/bounties')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all bounties for builder projects' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getBuilderBounties(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.builderService.getBuilderBounties(id, page, limit);
    return {
      data,
      message: 'Builder bounties retrieved successfully',
    };
  }
}
