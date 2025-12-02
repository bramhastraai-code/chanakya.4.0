import { Model } from 'mongoose';
import { Property } from 'src/property/entities/property.entity';
import { Project } from 'src/project/entities/project.entity';
import { SearchRecord } from './entity/search-record.entity';
import { PaginationDto } from './dto/create-search-filter.dto';
export declare class SearchFilterService {
    private readonly propertyModel;
    private readonly projectModel;
    private readonly searchRecordModel;
    constructor(propertyModel: Model<Property>, projectModel: Model<Project>, searchRecordModel: Model<SearchRecord>);
    getSuggestions(query: string): Promise<string[]>;
    storeSearch(userId: string, term: string): Promise<void>;
    search(term: string, paginationDto: PaginationDto): Promise<any>;
}
