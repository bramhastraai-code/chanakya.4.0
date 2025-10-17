// src/builders/builders.controller.ts
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UpdateBuilderDto } from './dto/create-builder.dto';

import { BuilderResponseDto } from './dto/builder-response.dto';
import { BuildersService } from './builder.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'src/common/interceptor/response.interface';
import { Customer } from './entities/customer.entity';

@ApiTags('user(builder)')
@Controller('customers')
export class BuildersController {
  constructor(private readonly buildersService: BuildersService) {}

  @Get('builders')
  @ApiOperation({ summary: 'Get all builders' })
  @ApiResponse({
    status: 200,
    description: 'List of all builders',
    type: [BuilderResponseDto],
  })
  async findAll(): Promise<Response<Customer[]>> {
    const data = await this.buildersService.findAll();
    return { data, message: 'Builders fetched successfully' };
  }

  @Get('builder')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a builder by ID' })
  @ApiResponse({
    status: 200,
    description: 'Builder found',
    type: BuilderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Builder not found' })
  async findOne(@Req() req: any): Promise<Response<Customer>> {
    const id = req.user._id;
    // const id = '67f51606ccc29f25b46e8a4a';
    const data = await this.buildersService.findOne(id);
    return { data, message: 'Builder found successfully' };
  }

  @Patch('builder')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a builder' })
  @ApiResponse({
    status: 200,
    description: 'Builder updated successfully',
    type: BuilderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Builder not found' })
  async update(
    @Req() req: any,
    @Body() updateBuilderDto: UpdateBuilderDto,
  ): Promise<Response<Customer>> {
    const id = req.user._id;
    // const id = '67f51606ccc29f25b46e8a4a';
    const data = await this.buildersService.update(id, updateBuilderDto);
    return { data, message: 'Builder updated successfully' };
  }
}
