import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Customer } from 'src/customer/entities/customer.entity';
import { Amenity } from 'src/amenity/entities/amenity.entity';
import { Status } from 'src/common/enum/status.enum';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery?: string,
    status?: Status,
  ): Promise<{
    properties: Property[];
    totalPages: number;
    totalProperties: number;
    pageSize: number;
    pageNumber: number;
  }> {
    try {
      const page = parseInt(pageNumber, 10) || 1;
      const size = parseInt(pageSize, 10) || 10;
      const skip = (page - 1) * size;

      const query: any = {};
      if (searchQuery) {
        query.$or = [
          { propertyTitle: { $regex: searchQuery, $options: 'i' } },
          { propertyDescription: { $regex: searchQuery, $options: 'i' } },
        ];
      }
      if (status && status !== 'all') {
        query.status = status;
      }

      const totalProperties = await this.propertyModel.countDocuments(query);
      const totalPages = Math.ceil(totalProperties / size);

      const properties = await this.propertyModel
        .find(query)
        .skip(skip)
        .limit(size)
        .populate('amenities', { strictPopulate: false }) // Populate amenities if available
        .sort({ [sortBy]: sortOrder ? -1 : -1 });

      return {
        properties,
        totalProperties,
        totalPages,
        pageSize: size,
        pageNumber: parseInt(pageNumber),
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Property> {
    try {
      const property = await this.propertyModel
        .findById(id)
        .populate({
          path: 'amenities',
          model: Amenity.name,
          strictPopulate: false,
        })
        .populate({
          path: 'facilities',
          model: Amenity.name,
          strictPopulate: false,
        })
        .exec();
      if (!property) {
        throw new NotFoundException('Property not found');
      }
      return property;
    } catch (error) {
      throw error;
    }
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      const createdProperty = new this.propertyModel(createPropertyDto);
      return await createdProperty.save();
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    try {
      const updatedProperty = await this.propertyModel
        .findByIdAndUpdate(id, updatePropertyDto, { new: true })
        .exec();
      if (!updatedProperty) {
        throw new NotFoundException('Property not found');
      }
      return updatedProperty;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const property = await this.propertyModel.findById(id).exec();
      if (!property) {
        throw new NotFoundException('Property not found');
      }
      await this.propertyModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw error;
    }
  }

  // website content______________________________________________________________________

  async getPropertySummaries(): Promise<Property[]> {
    const properties = await this.propertyModel
      .find(
        {},
        'thumbnail propertyTitle address price propertyStatus totalArea bedCount pricePerUnit tags featured amenities',
      )
      .populate('amenities') // Populate amenities if available
      .exec();

    if (!properties.length) {
      throw new NotFoundException('No properties found.');
    }
    return properties;
  }
  // PropertyCardList

  async getPropertyById(id: string): Promise<any> {
    const property = await this.propertyModel
      .findById(id)
      .populate({
        path: 'customer', // Assuming crmDetails references a Customer model
        select: 'name userImage responseTime phoneNumber userType', // Select specific fields
        model: Customer.name, // Reference the Customer model
      })
      .populate({
        strictPopulate: false,
        path: 'amenities',
        model: Amenity.name,
      }) // Populate other fields as needed
      .exec();

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Mapping Mongoose Document to DTO
    return {
      property,
      crmDetails: {
        crmName: 'crm name',
        crmProfileImageUrl: 'crm image',
        crmResponseTime: 'response tu=ime',
        crmMobile: '999999999999',
        crmRole: 'role',
      },
      // Handle case where crmDetails is not available
    };
  }
  async getPropertiesByProjectId(projectId: string): Promise<Property[]> {
    const properties = await this.propertyModel
      .find({ projectId })
      .populate('amenities', { strictPopulate: false })
      .exec();
    console.log('getPropertiesByProjectId', projectId, properties);
    if (!properties || properties.length === 0) {
      return [];
    }
    return properties;
  }

  async getPropertiesByCity(city: string): Promise<Property[]> {
    const properties = await this.propertyModel
      .find({ city })
      .populate('amenities', { strictPopulate: false })
      .exec();
    console.log('getPropertiesByProjectId', city, properties);
    if (!properties || properties.length === 0) {
      return [];
    }
    return properties;
  }

  async getFormattedProperties(): Promise<any[]> {
    // Fetch properties grouped by district, region, etc.
    const properties = await this.propertyModel
      .aggregate([
        {
          $group: {
            _id: {
              city: '$city', // Assuming 'state' represents districts
              region: '$region',
            },
            properties: {
              $push: {
                _id: '$_id',
                title: '$propertyTitle',
                imageURL: { $arrayElemAt: ['$images', 0] }, // Assuming the first image is the main one
              },
            },
          },
        },
        {
          $group: {
            _id: {
              city: '$_id.city',
            },
            regions: {
              $push: {
                _id: '$_id',
                regionName: '$_id.region',
                properties: '$properties',
              },
            },
          },
        },
        {
          $project: {
            city: '$_id.city',
            regions: 1,
            _id: 1,
          },
        },
      ])
      .exec();

    // Transform the aggregated data into the DTO format
    return properties.map((district) => ({
      city: district.city,
      regions: district.regions.map((region: any) => ({
        regionName: region.regionName,
        regionImage: region.properties[0]?.imageURL || '',
        properties: region.properties.map((property: any) => ({
          propertyId: property._id,
          title: property.title,
          imageURL: property.imageURL,
        })),
      })),
    }));
  }

  async createWeb(createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      const createdProperty = new this.propertyModel(createPropertyDto);
      return await createdProperty.save();
    } catch (error) {
      throw error;
    }
  }
}
