import { Model } from 'mongoose';
import { Saved } from './entities/saved.entity';
import { CreateSavedDto } from './dto/create-saved.dto';
import { UpdateSavedDto } from './dto/update-saved.dto';
export declare class SavedService {
    private readonly savedModel;
    constructor(savedModel: Model<Saved>);
    create(createSavedDto: CreateSavedDto): Promise<Saved>;
    update(id: string, updateSavedDto: UpdateSavedDto): Promise<Saved | null>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string): Promise<{
        savedItems: Saved[];
        totalPages: number;
        totalSavedItems: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Saved | null>;
    remove(id: string): Promise<{
        deletedCount: number;
    }>;
}
