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
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyFilterDto } from './dto/PropertyFilter.Dto';
import { Status } from 'src/common/enum/status.enum';
export declare class PropertyService {
    private propertyModel;
    constructor(propertyModel: Model<Property>);
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<{
        properties: Property[];
        totalPages: number;
        totalProperties: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Property>;
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    remove(id: string): Promise<void>;
    getPropertySummaries(): Promise<Property[]>;
    PropertyCardList(filterDto: PropertyFilterDto): Promise<{
        total: number;
        page: number;
        limit: number;
        results: {
            property: Omit<Omit<import("mongoose").Document<unknown, {}, Property> & Property & {
                _id: import("mongoose").Types.ObjectId;
            }, never>, never>;
            crmDetails: {
                crmName: string;
                crmProfileImageUrl: string;
                crmResponseTime: string;
                crmMobile: string;
                crmRole: import("../customer/enum/usertype.enum").UserType;
            };
        }[];
    }>;
    getPropertyById(id: string): Promise<any>;
    getPropertiesByProjectId(projectId: string): Promise<Property[]>;
    getPropertiesByCity(city: string): Promise<Property[]>;
    getFormattedProperties(): Promise<any[]>;
    createWeb(createPropertyDto: CreatePropertyDto): Promise<Property>;
}
