import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Amenity } from '../amenity/entities/amenity.entity';
import { Property } from 'src/property/entities/property.entity';
import { Project } from 'src/project/entities/project.entity';
import { PropertyFilter_V2_Dto, PropertyFilterDto } from './dto/filter.dto';
import { EntityType } from './enum/search.enum';
import {
  BHKConfiguration,
  PropertyType,
} from 'src/property/enum/property.enum';
import { SearchRecord } from './entity/search-record.entity';
import { PaginationDto } from './dto/create-search-filter.dto';

@Injectable()
export class SearchFilterService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<Property>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(SearchRecord.name)
    private readonly searchRecordModel: Model<SearchRecord>,
  ) {}

  // auto complere search
  async getSuggestions(query: string): Promise<string[]> {
    return this.searchRecordModel
      .find({ term: new RegExp(query, 'i'), userId: null })
      .sort({ popularity: -1 })
      .limit(10)
      .select('term -_id')
      .then((results) => results.map((result) => result.term));
  }

  async storeSearch(userId: string, term: string): Promise<void> {
    const now = new Date();

    // Store the user's search history
    await this.searchRecordModel.create({ term, userId, searchedAt: now });

    // Update or insert the suggestion data
    await this.searchRecordModel.updateOne(
      { term, userId: null }, // Only update if userId is null (suggestion entry)
      { $inc: { popularity: 1 } },
      { upsert: true },
    );
  }

  async search(term: string, paginationDto: PaginationDto): Promise<any> {
    try {
      const { page, limit } = paginationDto;
      const skip = (page - 1) * limit;

      // Find projects, matching the term in projectName (title)
      const projects = await this.projectModel
        .find({ projectName: { $regex: term, $options: 'i' } })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      // Find properties, matching the term in propertyTitle (title)
      const properties = await this.propertyModel
        .find({ propertyTitle: { $regex: term, $options: 'i' } })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      // Format projects
      const projectsWithTitle = projects.map((project) => ({
        _id: project._id,
        title: project.projectName,
        thumbnail: project.thumbnail,
        description: project.description,
        address: project.address,
        city: project.city,
        priceMin: project.priceMin,
        priceMax: project.priceMax,
        minCarpetArea: project.minCarpetArea,
        maxCarpetArea: project.maxCarpetArea,
        tags: project.tags,
        amenities: project.amenities,
        itsTypeIs: 'PROJECT',
      }));

      // Format properties
      const propertiesWithTitle = properties.map((property) => ({
        _id: property._id,
        title: property.propertyTitle,
        thumbnail: property.thumbnail,
        description: property.seoDescription,
        address: property.address,
        city: property.city,
        price: property.price,
        totalArea: property.totalArea,
        tags: property.tags,
        amenities: property.amenities,
        itsTypeIs: 'PROPERTY',
      }));

      // Combine the results
      const combinedResults = [...projectsWithTitle, ...propertiesWithTitle];

      return {
        status: 200,
        message: 'retrieve successfully',
        count: combinedResults.length,
        data: combinedResults,
      };
    } catch (error) {
      throw new Error('Error fetching search results: ' + error.message);
    }
  }
}
