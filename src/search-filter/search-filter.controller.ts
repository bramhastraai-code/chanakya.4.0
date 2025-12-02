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
