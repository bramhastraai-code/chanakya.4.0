/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { Property } from 'src/property/entities/property.entity';
import { Project } from 'src/project/entities/project.entity';
import { PropertyFilter_V2_Dto, PropertyFilterDto } from './dto/filter.dto';
import { SearchRecord } from './entity/search-record.entity';
import { PaginationDto } from './dto/create-search-filter.dto';
export declare class SearchFilterService {
    private readonly propertyModel;
    private readonly projectModel;
    private readonly searchRecordModel;
    constructor(propertyModel: Model<Property>, projectModel: Model<Project>, searchRecordModel: Model<SearchRecord>);
    PropertyCardList(filterDto: PropertyFilterDto): Promise<{
        total: number;
        page: number;
        limit: number;
        results: any;
    }>;
    private buildPropertyQuery;
    private buildProjectQuery;
    private formatProperty;
    private formatProject;
    PropertyCardList_v2(filterDto: PropertyFilter_V2_Dto): Promise<{
        total: number;
        page: number;
        limit: number;
        results: any[];
    }>;
    private buildPropertyQuery_V2;
    private buildProjectQuery_V2;
    private getSortOptionsProperty_v2;
    private getSortOptionsProject_v2;
    private formatProperty_V2;
    private formatProject_V2;
    getSuggestions(query: string): Promise<string[]>;
    storeSearch(userId: string, term: string): Promise<void>;
    search(term: string, paginationDto: PaginationDto): Promise<any>;
}
