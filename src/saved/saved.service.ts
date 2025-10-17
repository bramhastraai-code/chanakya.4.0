import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Saved } from './entities/saved.entity';
import { CreateSavedDto } from './dto/create-saved.dto';
import { UpdateSavedDto } from './dto/update-saved.dto';

@Injectable()
export class SavedService {
  constructor(
    @InjectModel(Saved.name) private readonly savedModel: Model<Saved>,
  ) {}

  async create(createSavedDto: CreateSavedDto): Promise<Saved> {
    const createdSaved = new this.savedModel(createSavedDto);
    return createdSaved.save();
  }

  async update(
    id: string,
    updateSavedDto: UpdateSavedDto,
  ): Promise<Saved | null> {
    const updatedSaved = await this.savedModel.findByIdAndUpdate(
      id,
      updateSavedDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedSaved) {
      throw new NotFoundException('Saved item not found');
    }
    return updatedSaved;
  }

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string = 'savedAt',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery?: string,
  ): Promise<{
    savedItems: Saved[];
    totalPages: number;
    totalSavedItems: number;
    pageSize: number;
    pageNumber: number;
  }> {
    const page = parseInt(pageNumber, 10) || 1;
    const limit = parseInt(pageSize, 10) || 10;
    const skip = (page - 1) * limit;

    const query = searchQuery ? { $text: { $search: searchQuery } } : {};

    const savedItems = await this.savedModel
      .find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalSavedItems = await this.savedModel.countDocuments(query);

    const totalPages = Math.ceil(totalSavedItems / limit);

    return {
      savedItems,
      totalPages,
      totalSavedItems,
      pageSize: limit,
      pageNumber: page,
    };
  }

  async findOne(id: string): Promise<Saved | null> {
    return this.savedModel.findById(id).exec();
  }

  async remove(id: string): Promise<{ deletedCount: number }> {
    const result = await this.savedModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Saved item not found');
    }
    return result;
  }
}
