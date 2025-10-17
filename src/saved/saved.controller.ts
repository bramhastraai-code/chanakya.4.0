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
import { SavedService } from './saved.service';
import { Saved } from './entities/saved.entity';
import { CreateSavedDto } from './dto/create-saved.dto';
import { UpdateSavedDto } from './dto/update-saved.dto';
import { Response } from 'src/common/interceptor/response.interface';

@ApiTags('saved')
@Controller('saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new saved item' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Saved item created successfully',
    type: Saved,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(
    @Body() createSavedDto: CreateSavedDto,
  ): Promise<Response<Saved>> {
    try {
      const data = await this.savedService.create(createSavedDto);
      return { data, message: 'Saved item created successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the saved item.',
      );
    }
  }

  @Patch('save/:id')
  @ApiOperation({ summary: 'Update an existing saved item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Saved item updated successfully',
    type: Saved,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Saved item not found',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async update(
    @Param('id') id: string,
    @Body() updateSavedDto: UpdateSavedDto,
  ): Promise<Saved> {
    try {
      const updatedSaved = await this.savedService.update(id, updateSavedDto);
      if (!updatedSaved) {
        throw new NotFoundException('Saved item not found');
      }
      return updatedSaved;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the saved item.',
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all saved items with pagination, sorting, and search',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: true,
    description: 'Number of saved items per page',
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
    enum: ['savedAt', 'createdAt', 'updatedAt'],
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
    description: 'Search term for filtering saved items',
  })
  @ApiOkResponse({
    description: 'List of saved items retrieved successfully',
    type: [Saved],
  })
  @ApiNotFoundResponse({
    description: 'No saved items found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string = 'savedAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchQuery') searchQuery?: string,
  ): Promise<
    Response<{
      savedItems: Saved[];
      totalPages: number;
      totalSavedItems: number;
      pageSize: number;
      pageNumber: number;
    }>
  > {
    try {
      const data = await this.savedService.findAll(
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
        searchQuery,
      );

      if (!data.savedItems || data.savedItems.length === 0) {
        throw new NotFoundException('No saved items found');
      }

      return { data, message: 'Retrieved saved items successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving saved items.',
      );
    }
  }

  @Get('save/:id')
  @ApiOperation({ summary: 'Retrieve a single saved item by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The saved item details',
    type: Saved,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Saved item not found',
  })
  async findOne(@Param('id') id: string): Promise<Response<Saved>> {
    try {
      const savedItem = await this.savedService.findOne(id);
      if (!savedItem) {
        throw new NotFoundException('Saved item not found');
      }
      return { data: savedItem, message: 'Saved item retrieved successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the saved item.',
      );
    }
  }

  @Delete('save/:id')
  @ApiOperation({ summary: 'Delete a saved item by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Saved item deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Saved item not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const result = await this.savedService.remove(id);
      if (result.deletedCount === 0) {
        throw new NotFoundException('Saved item not found');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the saved item.',
      );
    }
  }
}
