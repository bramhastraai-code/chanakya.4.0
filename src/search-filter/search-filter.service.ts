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

  async PropertyCardList(filterDto: PropertyFilterDto) {
    const { page = 1, limit = 10, city, search, type } = filterDto;

    let results: any = [],
      total: number = 0;
    const skip = (page - 1) * limit;

    // MongoDB Text Search-based query (or alternative)
    if (type === EntityType.PROPERTY) {
      const query: any = this.buildPropertyQuery(city, search);

      [results, total] = await Promise.all([
        this.propertyModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .populate({ path: 'amenities', model: Amenity.name })
          .exec(),
        this.propertyModel.countDocuments(query).exec(),
      ]);

      if (results.length === 0 && city) {
        // Clear city filter and re-run query without city
        const fallbackQuery: any = this.buildPropertyQuery(undefined, search);

        [results, total] = await Promise.all([
          this.propertyModel
            .find(fallbackQuery)
            .skip(skip)
            .limit(limit)
            .populate({ path: 'amenities', model: Amenity.name })
            .exec(),
          this.propertyModel.countDocuments(fallbackQuery).exec(),
        ]);
      }

      results = results.map(this.formatProperty);
    } else if (type === EntityType.PROJECT) {
      const query: any = this.buildProjectQuery(city, search);

      [results, total] = await Promise.all([
        this.projectModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .populate({ path: 'amenities', model: Amenity.name })
          .exec(),
        this.projectModel.countDocuments(query).exec(),
      ]);

      if (results.length === 0 && city) {
        // Clear city filter and re-run query without city
        const fallbackQuery: any = this.buildProjectQuery(undefined, search);

        [results, total] = await Promise.all([
          this.projectModel
            .find(fallbackQuery)
            .skip(skip)
            .limit(limit)
            .populate({ path: 'amenities', model: Amenity.name })
            .exec(),
          this.projectModel.countDocuments(fallbackQuery).exec(),
        ]);
      }

      results = results.map(this.formatProject);
    }

    return { total, page, limit, results };
  }

  // Helper to build property query
  private buildPropertyQuery(city?: string, search?: string) {
    const query: any = {};

    if (city) {
      query.$or = [
        { address: { $regex: city, $options: 'i' } },
        { city: { $regex: city, $options: 'i' } },
        { seoTitle: { $regex: city, $options: 'i' } },
        { seoDescription: { $regex: city, $options: 'i' } },
        { seoKeywords: { $regex: city, $options: 'i' } },
        { region: { $regex: city, $options: 'i' } },
      ];
    }

    if (search) {
      query.$text = { $search: search };
    }

    return query;
  }

  // Helper to build project query
  private buildProjectQuery(city?: string, search?: string) {
    const query: any = {};

    if (city) {
      query.$or = [
        { address: { $regex: city, $options: 'i' } },
        { city: { $regex: city, $options: 'i' } },
        { seoTitle: { $regex: city, $options: 'i' } },
        { seoDescription: { $regex: city, $options: 'i' } },
        { seoKeywords: { $regex: city, $options: 'i' } },
        { region: { $regex: city, $options: 'i' } },
      ];
    }

    if (search) {
      query.$text = { $search: search }; // Use MongoDB text search
    }

    return query;
  }

  // Helper function to format property data
  private formatProperty(property: any) {
    return {
      _id: property._id,
      title: property.propertyTitle,
      location: property.address,
      price: `${property.price} USD`,
      imageUrl: property.thumbnail,
      tags: property.tags.map((tag: any) => ({
        text: tag.text,
        variant: tag.variant,
        iconUrl: tag.iconUrl,
      })),
      amenities: property.amenities.map((amenity: any) => ({
        text: amenity.name,
        iconLocation: amenity.iconImage,
      })),
      crmDetails: {
        crmName: 'rakesh',
        crmProfileImageUrl: 'https://picsum.photos/id/1/200/300',
        crmResponseTime: '15 min',
        crmMobile: '9993313600',
        crmRole: 'user',
      },
    };
  }

  // Helper function to format project data
  private formatProject(project: any) {
    return {
      _id: project._id,
      title: project.projectName,
      location: project.address,
      priceMin: project.priceMin,
      priceMax: project.priceMax,
      minCarpetArea: project.minCarpetArea,
      maxCarpetArea: project.maxCarpetArea,
      imageUrl: project.thumbnail,
      tags: project.tags.map((tag: any) => ({
        text: tag.text,
        variant: tag.variant,
        iconUrl: tag.iconUrl,
      })),
      amenities: project.amenities.map((amenity: any) => ({
        text: amenity.name,
        iconLocation: amenity.iconImage,
      })),
      readyToPossessDate: project.readyToPossessDate,
      crmDetails: {
        crmName: 'rakesh',
        crmProfileImageUrl: 'https://picsum.photos/id/1/200/300',
        crmResponseTime: '15 min',
        crmMobile: '9993313600',
        crmRole: 'user',
      },
    };
  }

  async PropertyCardList_v2(filterDto: PropertyFilter_V2_Dto) {
    const {
      page = 1,
      limit = 10,
      city,
      search,
      type,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      sort,
      propertyType,
      propertyConfig,
    } = filterDto;
    console.log('filterDto', filterDto);

    const skip = (page - 1) * limit;
    let results: any[] = [];
    let total = 0;

    const query =
      type === EntityType.PROPERTY
        ? this.buildPropertyQuery_V2(
            city,
            search,
            minPrice,
            maxPrice,
            minArea,
            maxArea,
            propertyType,
            propertyConfig,
          )
        : this.buildProjectQuery_V2(
            city,
            search,
            minPrice,
            maxPrice,
            minArea,
            maxArea,
            propertyType,
            propertyConfig,
          );

    const projection =
      type === EntityType.PROPERTY
        ? {
            title: 1,
            address: 1,
            price: 1,
            area: 1,
            thumbnail: 1,
            tags: 1,
            amenities: 1,
            propertyType: 1,
            propertyConfig: 1,
          }
        : {
            projectName: 1,
            address: 1,
            priceMin: 1,
            priceMax: 1,
            minCarpetArea: 1,
            maxCarpetArea: 1,
            thumbnail: 1,
            tags: 1,
            amenities: 1,
            readyToPossessDate: 1,
            propertyType: 1,
            propertyConfig: 1,
          };

    const sortOptionsProperty = this.getSortOptionsProperty_v2(sort);
    const sortOptionsProject = this.getSortOptionsProject_v2(sort);
    [results, total] = await Promise.all([
      type === EntityType.PROPERTY
        ? this.propertyModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort(sortOptionsProperty)
            .select(projection)
            .populate({ path: 'amenities', model: Amenity.name })
            .exec()
        : this.projectModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort(sortOptionsProject)
            .select(projection)
            .populate({ path: 'amenities', model: Amenity.name })
            .exec(),
      type === EntityType.PROPERTY
        ? this.propertyModel.countDocuments(query).exec()
        : this.projectModel.countDocuments(query).exec(),
    ]);

    results =
      type === EntityType.PROPERTY
        ? results.map(this.formatProperty_V2)
        : results.map(this.formatProject_V2);

    return { total, page, limit, results };
  }
  private buildPropertyQuery_V2(
    city?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    minArea?: number,
    maxArea?: number,
    propertyType?: PropertyType,
    propertyConfig?: BHKConfiguration[],
  ): any {
    const query: any = {};

    // Initialize $and array if we have conditions to add
    const andConditions: any[] = [];

    if (city) {
      andConditions.push({
        $or: [
          { address: { $regex: city, $options: 'i' } },
          { city: { $regex: city, $options: 'i' } },
        ],
      });
    }

    if (search) {
      andConditions.push({
        $text: { $search: search },
      });
    }

    if (minPrice !== undefined) {
      andConditions.push({ price: { $gte: minPrice } });
    }

    if (maxPrice !== undefined) {
      andConditions.push({ price: { $lte: maxPrice } });
    }

    if (minArea !== undefined) {
      andConditions.push({ totalArea: { $gte: minArea } });
    }

    if (maxArea !== undefined) {
      andConditions.push({ totalArea: { $lte: maxArea } });
    }

    if (propertyType) {
      andConditions.push({
        $or: [{ propertyType: { $regex: propertyType, $options: 'i' } }],
      });
    }

    if (propertyConfig) {
      andConditions.push({
        $or: [{ bhkConfiguration: { $regex: propertyConfig, $options: 'i' } }],
      });
    }

    // Only add $and if there are conditions
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    return query;
  }

  private buildProjectQuery_V2(
    city?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    minArea?: number,
    maxArea?: number,
    propertyType?: PropertyType,
    propertyConfig?: BHKConfiguration[],
  ): any {
    const query: any = {};

    // Initialize $and array if we have conditions to add
    const andConditions: any[] = [];

    if (city) {
      andConditions.push({
        $or: [
          { address: { $regex: city, $options: 'i' } },
          { city: { $regex: city, $options: 'i' } },
        ],
      });
    }

    if (search) {
      andConditions.push({
        $text: { $search: search },
      });
    }

    if (minPrice !== undefined) {
      andConditions.push({ priceMin: { $gte: minPrice } });
    }

    if (maxPrice !== undefined) {
      andConditions.push({ priceMax: { $lte: maxPrice } });
    }

    if (minArea !== undefined) {
      andConditions.push({ minCarpetArea: { $gte: minArea } });
    }

    if (maxArea !== undefined) {
      andConditions.push({ maxCarpetArea: { $lte: maxArea } });
    }

    if (propertyType) {
      andConditions.push({
        $or: [{ projectType: { $regex: propertyType, $options: 'i' } }],
      });
    }

    if (propertyConfig && propertyConfig.length > 0) {
      andConditions.push({
        PropertyConfig: { $in: propertyConfig }, // Assuming propertyConfig is an array
      });
    }

    // Only add $and if there are conditions
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    return query;
  }

  private getSortOptionsProperty_v2(sort: string): { [key: string]: 1 | -1 } {
    switch (sort) {
      case 'priceAsc':
        return { price: 1 };
      case 'priceDesc':
        return { price: -1 };
      case 'areaAsc':
        return { totalArea: 1 };
      case 'areaDesc':
        return { totalArea: -1 };
      default:
        return {};
    }
  }

  private getSortOptionsProject_v2(sort: string): { [key: string]: 1 | -1 } {
    switch (sort) {
      case 'priceAsc':
        return { priceAverage: 1 };
      case 'priceDesc':
        return { priceAverage: -1 };
      case 'areaAsc':
        return { maxCarpetArea: 1 };
      case 'areaDesc':
        return { minCarpetArea: -1 };
      default:
        return {};
    }
  }

  private formatProperty_V2(property: any) {
    return property;
  }

  private formatProject_V2(project: any) {
    return project;
  }
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
        .find({ projectName: { $regex: term, $options: 'i' } }) // case-insensitive search
        .skip(skip)
        .limit(limit) // Only include the projectName field
        .exec();

      // Find properties, matching the term in propertyTitle (title)
      const properties = await this.propertyModel
        .find({ propertyTitle: { $regex: term, $options: 'i' } }) // case-insensitive search
        .skip(skip)
        .limit(limit)
        .exec();

      // Rename projectName and propertyTitle to 'title'
      const projectsWithTitle = projects.map((project) => ({
        ...project,
        itsTypeIs: 'PROJECT',
      }));

      const propertiesWithTitle = properties.map((property) => ({
        ...property,
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
