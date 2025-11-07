import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Property } from './entities/property.entity';
import { S3Service } from 'src/s3/s3.service';
import { Response } from 'src/common/interceptor/response.interface';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Status } from 'src/common/enum/status.enum';
export declare class PropertyController {
    private readonly propertyService;
    private readonly s3Service;
    constructor(propertyService: PropertyService, s3Service: S3Service);
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<Response<{
        properties: Property[];
        totalPages: number;
        totalProperties: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<{
        data: Property;
        message: string;
    }>;
    create(createPropertyDto: CreatePropertyDto): Promise<{
        data: Property;
        message: string;
    }>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<{
        data: Property;
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getPropertySummaries(): Promise<Response<Property[]>>;
    getPropertyById(id: string): Promise<Response<any>>;
    getPropertyByCity(city: string): Promise<Response<any>>;
    getFormattedProperties(res: any): Promise<any>;
    createWeb(createPropertyDto: CreatePropertyDto): Promise<{
        data: Property;
        message: string;
    }>;
}
