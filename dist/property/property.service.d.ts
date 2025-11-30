import { Model } from 'mongoose';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
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
    getPropertyById(id: string): Promise<any>;
    getPropertiesByProjectId(projectId: string): Promise<Property[]>;
    getPropertiesByCity(city: string): Promise<Property[]>;
    getFormattedProperties(): Promise<any[]>;
    createWeb(createPropertyDto: CreatePropertyDto): Promise<Property>;
}
