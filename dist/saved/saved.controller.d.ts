import { SavedService } from './saved.service';
import { Saved } from './entities/saved.entity';
import { CreateSavedDto } from './dto/create-saved.dto';
import { UpdateSavedDto } from './dto/update-saved.dto';
import { Response } from 'src/common/interceptor/response.interface';
export declare class SavedController {
    private readonly savedService;
    constructor(savedService: SavedService);
    create(createSavedDto: CreateSavedDto): Promise<Response<Saved>>;
    update(id: string, updateSavedDto: UpdateSavedDto): Promise<Saved>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string): Promise<Response<{
        savedItems: Saved[];
        totalPages: number;
        totalSavedItems: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<Saved>>;
    remove(id: string): Promise<void>;
}
