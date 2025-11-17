import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchFilterService } from './search-filter.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PropertyFilter_V2_Dto, PropertyFilterDto } from './dto/filter.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { CreateSearchDto, PaginationDto } from './dto/create-search-filter.dto';

@Controller('search')
@ApiTags('search-filter')
export class SearchFilterController {
  constructor(private readonly searchFilterService: SearchFilterService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get filtered list of properties or projects' })
  async getPropertyList(
    @Query() filterDto: PropertyFilterDto,
  ): Promise<
    Response<{ total: any; page: number; limit: number; results: any[] }>
  > {
    const data = await this.searchFilterService.PropertyCardList(filterDto);
    return { data, message: 'retrieve successfully' };
  }

  @Get('search-filter')
  @ApiOperation({ summary: 'Get filtered property listings' })
  async getProperties(@Query() filterDto: PropertyFilter_V2_Dto) {
    const data = await this.searchFilterService.PropertyCardList_v2(filterDto);
    return { data, message: 'retrieve successfully' };
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get auto-complete search suggestions' })
  @ApiQuery({
    name: 'query',
    type: String,
    description: 'Search term to get suggestions for',
  })
  @ApiResponse({
    status: 200,
    description: 'List of search suggestions',
    type: [String],
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameter' })
  async getSuggestions(@Query('query') query: string): Promise<string[]> {
    return this.searchFilterService.getSuggestions(query);
  }

  @Post('store')
  @ApiOperation({ summary: 'Store a search term for history and suggestions' })
  @ApiResponse({ status: 201, description: 'Search term successfully stored' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async storeSearch(@Body() createSearchDto: CreateSearchDto): Promise<void> {
    const { userId, term } = createSearchDto;
    return this.searchFilterService.storeSearch(userId, term);
  }

  @Get('search-suggestions')
  async searchSuggestions(
    @Query('term') term: string,
    @Query() paginationDto: PaginationDto, // Get pagination from query params
  ) {
    if (!term || term.trim() === '') {
      throw new Error('Search term cannot be empty');
    }

    const data = await this.searchFilterService.search(term, paginationDto);
    return { data, message: 'retrieve successfully' };
  }
}
