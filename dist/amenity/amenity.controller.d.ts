import { AmenityService } from './amenity.service';
import { Amenity } from './entities/amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { Response } from 'src/common/interceptor/response.interface';
export declare class AmenityController {
    private readonly amenityService;
    constructor(amenityService: AmenityService);
    create(createAmenityDto: CreateAmenityDto): Promise<Response<Amenity>>;
    update(id: string, updateAmenityDto: UpdateAmenityDto): Promise<Amenity>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string): Promise<Response<{
        amenities: Amenity[];
        totalPages: number;
        totalAmenities: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<Amenity>>;
    remove(id: string): Promise<void>;
    amenityList(): Promise<Response<{
        value: string;
        label: string;
    }[]>>;
}
