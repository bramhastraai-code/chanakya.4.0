import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';
import { Role } from './entity/role.entity';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'Role successfully created.',
    type: Role,
  })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.roleService.create(createRoleDto);
    return { data, message: 'created successfully ' };
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of roles retrieved successfully.',
    type: [Role],
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Sort order (asc or desc)',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Name filter',
  })
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('name') name?: string,
  ) {
    const data = await this.roleService.findAll({
      page,
      limit,
      sortBy,
      sortOrder,
      name,
    });
    return { data, message: 'data retrieve successfully' };
  }

  @Get('role/:id')
  @ApiOperation({ summary: 'Get a single role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully.',
    type: Role,
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async findOne(@Param('id') id: string) {
    const data = await this.roleService.findOne(id);
    return { data, message: 'retrieve successful' };
  }

  @Patch('role/:id')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully.',
    type: Role,
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const data = await this.roleService.update(id, updateRoleDto);
    return { data, message: 'successful' };
  }

  @Delete('role/:id')
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Get('role-list')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of roles retrieved successfully.',
    type: [Role],
  })
  async roleList() {
    const data = await this.roleService.roleList();
    return { data, message: 'data retrieve successfully' };
  }
}
