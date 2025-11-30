import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Status } from 'src/common/enum/status.enum';
import { Amenity } from 'src/amenity/entities/amenity.entity';
import { BookmarkedProperty } from './entities/bookmarked-property.entity';

interface FilterOptions {
  page: number;
  limit: number;
  search?: string;
  city?: string;
  state?: string;
  propertyType?: string;
  propertyPurpose?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  featured?: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  status?: Status;
}

@Injectable()
export class PropertyEnhancedService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    @InjectModel(BookmarkedProperty.name)
    private bookmarkedPropertyModel: Model<BookmarkedProperty>,
  ) {}

  /**
   * Find all properties with comprehensive filtering
   */
  async findAllWithFilters(options: FilterOptions) {
    const {
      page,
      limit,
      search,
      city,
      state,
      propertyType,
      propertyPurpose,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      featured,
      sortBy,
      sortOrder,
      status,
    } = options;

    const query: any = {};

    // Status filter
    if (status) {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { propertyTitle: { $regex: search, $options: 'i' } },
        { propertyDescription: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    // Location filters
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    // Property type filters
    if (propertyType) {
      query.propertyType = propertyType;
    }
    if (propertyPurpose) {
      query.propertyPurpose = propertyPurpose;
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // Configuration filters
    if (bedrooms !== undefined) {
      query.bedCount = bedrooms;
    }
    if (bathrooms !== undefined) {
      query.bathroomCount = bathrooms;
    }

    // Area filter
    if (minArea !== undefined || maxArea !== undefined) {
      query.totalArea = {};
      if (minArea !== undefined) query.totalArea.$gte = minArea;
      if (maxArea !== undefined) query.totalArea.$lte = maxArea;
    }

    // Featured filter
    if (featured !== undefined) {
      query.featured = featured;
    }

    const skip = (page - 1) * limit;

    // Build sort object
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find(query)
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
        .populate({
          path: 'builderId',
          strictPopulate: false,
        })
        .populate({
          path: 'customer',
          select: 'name phoneNumber email',
          strictPopulate: false,
        })
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.propertyModel.countDocuments(query),
    ]);

    return {
      properties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Find one property with full details
   */
  async findOneWithDetails(id: string) {
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
      .populate({
        path: 'builderId',
        strictPopulate: false,
      })
      .populate({
        path: 'projectId',
        strictPopulate: false,
      })
      .populate({
        path: 'customer',
        select: 'name phoneNumber email rating closedDeals',
        strictPopulate: false,
      })
      .exec();

    if (!property) {
      return null;
    }

    return property;
  }

  /**
   * Increment property views
   */
  async incrementViews(id: string): Promise<void> {
    await this.propertyModel.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    });
  }

  /**
   * Find agent's properties
   */
  async findAgentProperties(
    agentId: string,
    page: number,
    limit: number,
    status?: Status,
    search?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const query: any = { customer: agentId };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { propertyTitle: { $regex: search, $options: 'i' } },
        { propertyDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find(query)
        .populate({
          path: 'amenities',
          model: Amenity.name,
          strictPopulate: false,
        })
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.propertyModel.countDocuments(query),
    ]);

    return {
      properties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Create property for agent
   */
  async createProperty(createPropertyDto: CreatePropertyDto, agentId: string) {
    const property = new this.propertyModel({
      ...createPropertyDto,
      customer: agentId,
      createdBy: agentId,
      status: Status.IN_ACTIVE, // Pending approval
      views: 0,
    });

    return await property.save();
  }

  /**
   * Update property
   */
  async updateProperty(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    userId: string,
  ) {
    const property = await this.propertyModel.findByIdAndUpdate(
      id,
      {
        ...updatePropertyDto,
        updatedBy: userId,
      },
      { new: true },
    );

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  /**
   * Find builder's properties
   */
  async findBuilderProperties(
    builderId: string,
    page: number,
    limit: number,
    status?: Status,
    search?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const query: any = { builderId };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { propertyTitle: { $regex: search, $options: 'i' } },
        { propertyDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find(query)
        .populate({
          path: 'amenities',
          model: Amenity.name,
          strictPopulate: false,
        })
        .populate({
          path: 'projectId',
          strictPopulate: false,
        })
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.propertyModel.countDocuments(query),
    ]);

    return {
      properties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Create property for builder
   */
  async createBuilderProperty(
    createPropertyDto: CreatePropertyDto,
    builderId: string,
  ) {
    const property = new this.propertyModel({
      ...createPropertyDto,
      builderId,
      createdBy: builderId,
      status: Status.IN_ACTIVE, // Pending approval
      views: 0,
    });

    return await property.save();
  }

  /**
   * Find pending properties for admin approval
   */
  async findPendingProperties(page: number, limit: number) {
    const query = { status: Status.IN_ACTIVE };
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find(query)
        .populate({
          path: 'customer',
          select: 'name phoneNumber email',
          strictPopulate: false,
        })
        .populate({
          path: 'builderId',
          strictPopulate: false,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.propertyModel.countDocuments(query),
    ]);

    return {
      properties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Approve property
   */
  async approveProperty(id: string, adminId: string) {
    const property = await this.propertyModel.findById(id);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status === Status.ACTIVE) {
      throw new BadRequestException('Property is already approved');
    }

    property.status = Status.ACTIVE;
    property.updatedBy = adminId as any;

    await property.save();

    // TODO: Send notification to property owner

    return property;
  }

  /**
   * Reject property
   */
  async rejectProperty(id: string, reason: string, adminId: string) {
    const property = await this.propertyModel.findById(id);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    property.status = Status.IN_ACTIVE;
    property.updatedBy = adminId as any;

    await property.save();

    // TODO: Send notification to property owner with rejection reason

    return property;
  }

  /**
   * Find all properties for admin
   */
  async findAllForAdmin(
    page: number,
    limit: number,
    status?: Status,
    search?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { propertyTitle: { $regex: search, $options: 'i' } },
        { propertyDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [properties, total, stats] = await Promise.all([
      this.propertyModel
        .find(query)
        .populate({
          path: 'customer',
          select: 'name phoneNumber email',
          strictPopulate: false,
        })
        .populate({
          path: 'builderId',
          strictPopulate: false,
        })
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.propertyModel.countDocuments(query),
      this.getPropertyStats(),
    ]);

    return {
      properties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
      stats,
    };
  }

  /**
   * Get property statistics for admin
   */
  private async getPropertyStats() {
    const [total, active, pending, totalViews] = await Promise.all([
      this.propertyModel.countDocuments(),
      this.propertyModel.countDocuments({ status: Status.ACTIVE }),
      this.propertyModel.countDocuments({ status: Status.IN_ACTIVE }),
      this.propertyModel.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } },
      ]),
    ]);

    return {
      total,
      active,
      pending,
      totalViews: totalViews[0]?.totalViews || 0,
    };
  }

  /**
   * Bookmark property
   */
  async bookmarkProperty(agentId: string, propertyId: string) {
    // Check if property exists
    const property = await this.propertyModel.findById(propertyId);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Check if already bookmarked
    const existing = await this.bookmarkedPropertyModel.findOne({
      agent: agentId,
      property: propertyId,
    });

    if (existing) {
      throw new ConflictException('Property already bookmarked');
    }

    const bookmark = new this.bookmarkedPropertyModel({
      agent: agentId,
      property: propertyId,
    });

    await bookmark.save();

    return { message: 'Property bookmarked successfully' };
  }

  /**
   * Remove bookmark
   */
  async removeBookmark(agentId: string, propertyId: string) {
    const result = await this.bookmarkedPropertyModel.findOneAndDelete({
      agent: agentId,
      property: propertyId,
    });

    if (!result) {
      throw new NotFoundException('Bookmark not found');
    }

    return { message: 'Bookmark removed successfully' };
  }

  /**
   * Get bookmarked properties
   */
  async getBookmarkedProperties(
    agentId: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      this.bookmarkedPropertyModel
        .find({ agent: agentId })
        .populate({
          path: 'property',
          populate: [
            {
              path: 'amenities',
              model: Amenity.name,
              strictPopulate: false,
            },
            {
              path: 'customer',
              select: 'name phoneNumber email',
              strictPopulate: false,
            },
          ],
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookmarkedPropertyModel.countDocuments({ agent: agentId }),
    ]);

    const properties = bookmarks.map((b: any) => b.property);

    return {
      properties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Get top locations
   */
  async getTopLocations(limit: number = 10) {
    const topCities = await this.propertyModel.aggregate([
      { $match: { status: Status.ACTIVE } },
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    return topCities.map((city) => ({
      city: city._id,
      propertyCount: city.count,
      averagePrice: Math.round(city.avgPrice),
    }));
  }

  /**
   * Get nearby properties
   */
  async getNearbyProperties(
    propertyId: string,
    limit: number = 10,
  ) {
    const property = await this.propertyModel.findById(propertyId);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Find properties in the same city with similar price range
    const priceRange = property.price * 0.2; // 20% price range

    const nearbyProperties = await this.propertyModel
      .find({
        _id: { $ne: propertyId },
        city: property.city,
        status: Status.ACTIVE,
        price: {
          $gte: property.price - priceRange,
          $lte: property.price + priceRange,
        },
      })
      .populate({
        path: 'amenities',
        model: Amenity.name,
        strictPopulate: false,
      })
      .limit(limit)
      .exec();

    return nearbyProperties;
  }

  /**
   * Get property recommendations for agent
   */
  async getRecommendations(agentId: string, limit: number = 10) {
    // Get agent's recent property views/bookmarks to understand preferences
    const bookmarks = await this.bookmarkedPropertyModel
      .find({ agent: agentId })
      .populate('property')
      .limit(5)
      .exec();

    if (bookmarks.length === 0) {
      // Return trending properties if no bookmarks
      return await this.propertyModel
        .find({ status: Status.ACTIVE })
        .sort({ views: -1 })
        .limit(limit)
        .populate({
          path: 'amenities',
          model: Amenity.name,
          strictPopulate: false,
        })
        .exec();
    }

    // Extract preferences from bookmarks
    const properties = bookmarks.map((b: any) => b.property);
    const cities = [...new Set(properties.map((p: any) => p.city))];
    const propertyTypes = [...new Set(properties.map((p: any) => p.propertyType))];

    // Find similar properties
    const recommendations = await this.propertyModel
      .find({
        status: Status.ACTIVE,
        $or: [
          { city: { $in: cities } },
          { propertyType: { $in: propertyTypes } },
        ],
      })
      .sort({ views: -1, createdAt: -1 })
      .limit(limit)
      .populate({
        path: 'amenities',
        model: Amenity.name,
        strictPopulate: false,
      })
      .exec();

    return recommendations;
  }
}
