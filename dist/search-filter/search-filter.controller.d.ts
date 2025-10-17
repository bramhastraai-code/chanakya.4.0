import { SearchFilterService } from './search-filter.service';
import { PropertyFilter_V2_Dto, PropertyFilterDto } from './dto/filter.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { CreateSearchDto, PaginationDto } from './dto/create-search-filter.dto';
export declare class SearchFilterController {
    private readonly searchFilterService;
    constructor(searchFilterService: SearchFilterService);
    getPropertyList(filterDto: PropertyFilterDto): Promise<Response<{
        total: any;
        page: number;
        limit: number;
        results: any[];
    }>>;
    getProperties(filterDto: PropertyFilter_V2_Dto): Promise<{
        data: {
            total: number;
            page: number;
            limit: number;
            results: any[];
        };
        message: string;
    }>;
    getSuggestions(query: string): Promise<string[]>;
    storeSearch(createSearchDto: CreateSearchDto): Promise<void>;
    searchSuggestions(term: string, paginationDto: PaginationDto): Promise<{
        data: any;
        message: string;
    }>;
}
