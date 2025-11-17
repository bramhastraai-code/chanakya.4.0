import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Amenity } from './entities/amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';

@Injectable()
export class AmenityService {
  constructor(
    @InjectModel(Amenity.name) private readonly amenityModel: Model<Amenity>,
  ) {}

  async create(createAmenityDto: CreateAmenityDto): Promise<Amenity> {
    try {
      console.count('issie1');

      const checkAmenity = await this.amenityModel.findOne({
        name: createAmenityDto.name,
      });
      if (checkAmenity) {
        throw new ConflictException('amenity is already available');
      }
      console.log('amenity service create ', createAmenityDto);
      const createdAmenity = new this.amenityModel(createAmenityDto);
      return await createdAmenity.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the amenity.',
      );
    }
  }

  async update(
    id: string,
    updateAmenityDto: UpdateAmenityDto,
  ): Promise<Amenity | null> {
    try {
      const updatedAmenity = await this.amenityModel
        .findByIdAndUpdate(id, updateAmenityDto, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (!updatedAmenity) {
        throw new NotFoundException('Amenity not found');
      }
      return updatedAmenity;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the amenity.',
      );
    }
  }

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery?: string,
  ): Promise<{
    amenities: Amenity[];
    totalPages: number;
    totalAmenities: number;
    pageSize: number;
    pageNumber: number;
  }> {
    try {
      const size = parseInt(pageSize, 10) || 10;
      const page = parseInt(pageNumber, 10) || 1;
      const skip = (page - 1) * size;

      const query: any = {};
      if (searchQuery) {
        query.$or = [{ name: { $regex: searchQuery, $options: 'i' } }];
      }

      const totalAmenities = await this.amenityModel.countDocuments(query);
      const totalPages = Math.ceil(totalAmenities / size);

      const amenities = await this.amenityModel
        .find(query)
        .skip(skip)
        .limit(size)
        .sort({ [sortBy]: sortOrder })
        .exec();

      return {
        amenities,
        totalPages,
        totalAmenities,
        pageSize: size,
        pageNumber: page,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving amenities.',
      );
    }
  }

  async findOne(id: string): Promise<Amenity | null> {
    try {
      const amenity = await this.amenityModel.findById(id).exec();
      if (!amenity) {
        throw new NotFoundException('Amenity not found');
      }
      return amenity;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the amenity.',
      );
    }
  }

  async remove(id: string): Promise<{ deletedCount: number }> {
    try {
      const result = await this.amenityModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException('Amenity not found');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the amenity.',
      );
    }
  }
  async AmenityList() {
    const amenities = await this.amenityModel.find().exec();
    const data = amenities.map((amenity) => ({
      value: amenity._id, // assuming name is the value you want
      label: amenity.name, // or any other field for the label
    }));
    return data;
  }
}
