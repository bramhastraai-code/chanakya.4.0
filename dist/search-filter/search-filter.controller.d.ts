import { SearchFilterService } from './search-filter.service';
import { PaginationDto } from './dto/create-search-filter.dto';
export declare class SearchFilterController {
    private readonly searchFilterService;
    constructor(searchFilterService: SearchFilterService);
    searchSuggestions(term: string, paginationDto: PaginationDto): Promise<{
        data: any;
        message: string;
    }>;
}
