import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Amenity } from './entities/amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';

@Injectable()
export class AmenityService {
  private readonly logger = new Logger(AmenityService.name);

  constructor(
    @InjectModel(Amenity.name) private readonly amenityModel: Model<Amenity>,
  ) {}

  async create(createAmenityDto: CreateAmenityDto): Promise<Amenity> {
    this.logger.log(`Creating amenity: ${createAmenityDto.name}`);

    const existingAmenity = await this.amenityModel.findOne({
      name: createAmenityDto.name,
    });

    if (existingAmenity) {
      throw new ConflictException(
        `Amenity with name '${createAmenityDto.name}' already exists`,
      );
    }

    const createdAmenity = new this.amenityModel(createAmenityDto);
    return await createdAmenity.save();
  }

  async update(
    id: string,
    updateAmenityDto: UpdateAmenityDto,
  ): Promise<Amenity> {
    this.logger.log(`Updating amenity with ID: ${id}`);

    const updatedAmenity = await this.amenityModel
      .findByIdAndUpdate(id, updateAmenityDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedAmenity) {
      throw new NotFoundException(`Amenity with ID '${id}' not found`);
    }

    return updatedAmenity;
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
    const size = parseInt(pageSize, 10) || 10;
    const page = parseInt(pageNumber, 10) || 1;
    const skip = (page - 1) * size;

    const query: any = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: searchQuery, $options: 'i' } }];
    }

    this.logger.log(
      `Fetching amenities - Page: ${page}, Size: ${size}, Search: ${searchQuery || 'none'}`,
    );

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
  }

  async findOne(id: string): Promise<Amenity> {
    this.logger.log(`Fetching amenity with ID: ${id}`);

    const amenity = await this.amenityModel.findById(id).exec();

    if (!amenity) {
      throw new NotFoundException(`Amenity with ID '${id}' not found`);
    }

    return amenity;
  }

  async remove(id: string): Promise<{ deletedCount: number }> {
    this.logger.log(`Deleting amenity with ID: ${id}`);

    const result = await this.amenityModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Amenity with ID '${id}' not found`);
    }

    return result;
  }

  async AmenityList(): Promise<{ value: string; label: string }[]> {
    this.logger.log('Fetching amenity list');

    const amenities = await this.amenityModel.find().exec();

    return amenities.map((amenity) => ({
      value: amenity._id.toString(),
      label: amenity.name,
    }));
  }
}
