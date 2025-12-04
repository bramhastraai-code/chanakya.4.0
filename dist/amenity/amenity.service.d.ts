import { Model } from 'mongoose';
import { Amenity } from './entities/amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
export declare class AmenityService {
    private readonly amenityModel;
    private readonly logger;
    constructor(amenityModel: Model<Amenity>);
    create(createAmenityDto: CreateAmenityDto): Promise<Amenity>;
    update(id: string, updateAmenityDto: UpdateAmenityDto): Promise<Amenity>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string): Promise<{
        amenities: Amenity[];
        totalPages: number;
        totalAmenities: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Amenity>;
    remove(id: string): Promise<{
        deletedCount: number;
    }>;
    AmenityList(): Promise<{
        value: string;
        label: string;
    }[]>;
}
