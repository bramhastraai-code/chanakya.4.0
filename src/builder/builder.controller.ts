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
} from '@nestjs/common';
import { BuilderService } from './builder.service';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { UpdateBuilderDto } from './dto/update-builder.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Builder by Admin')
@ApiBearerAuth()
@Controller('builder-by-admin')
@UseGuards(jwtGuard, RolesGuard)
export class BuilderController {
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
}
