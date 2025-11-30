import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Property } from '../entities/property.entity';
import { CreatePropertyDto, UpdatePropertyDto } from '../dto/v1/property.dto';
import { Status } from 'src/common/enum/status.enum';

@Injectable()
export class PropertyV1Service {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}

  /**
   * Create new property
   */
  async create(ownerId: Types.ObjectId, dto: CreatePropertyDto) {
    const property = await this.propertyModel.create({
      ...dto,
      ownerId,
      createdBy: ownerId,
      approvalStatus: 'pending',
      status: Status.ACTIVE,
    });

    return property;
  }

  /**
   * Find all approved properties (public)
   */
  async findAllApproved(filters: any = {}) {
    const {
      page = 1,
      limit = 20,
      city,
      state,
      propertyType,
      propertyPurpose,
      minPrice,
      maxPrice,
      bhkConfiguration,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const query: any = {
      approvalStatus: 'approved',
      status: Status.ACTIVE,
    };

    // Apply filters
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    if (propertyType) query.propertyType = propertyType;
    if (propertyPurpose) query.propertyPurpose = propertyPurpose;
    if (bhkConfiguration) query.bhkConfiguration = bhkConfiguration;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('ownerId', 'email')
        .exec(),
      this.propertyModel.countDocuments(query),
    ]);

    return {
      properties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Find properties by owner
   */
  async findByOwner(ownerId: Types.ObjectId, filters: any = {}) {
    const { page = 1, limit = 20, approvalStatus } = filters;

    const query: any = { ownerId };
    if (approvalStatus) query.approvalStatus = approvalStatus;

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.propertyModel.countDocuments(query),
    ]);

    return {
      properties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Find one property by ID
   */
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid property ID');
    }

    const property = await this.propertyModel
      .findById(id)
      .populate('ownerId', 'email')
      .populate('amenities')
      .populate('facilities')
      .exec();

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  /**
   * Find one approved property (public access)
   */
  async findOneApproved(id: string) {
    const property = await this.findOne(id);

    if (property.approvalStatus !== 'approved') {
      throw new NotFoundException('Property not found');
    }

    // Increment views
    await this.propertyModel.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    });

    return property;
  }

  /**
   * Update property
   */
  async update(id: string, ownerId: Types.ObjectId, dto: UpdatePropertyDto) {
    const property = await this.findOne(id);

    // Check ownership
    if (property.ownerId.toString() !== ownerId.toString()) {
      throw new ForbiddenException('You can only update your own properties');
    }

    Object.assign(property, dto);
    property.updatedBy = ownerId;
    await property.save();

    return property;
  }

  /**
   * Delete property
   */
  async delete(id: string, ownerId: Types.ObjectId) {
    const property = await this.findOne(id);

    // Check ownership
    if (property.ownerId.toString() !== ownerId.toString()) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    await this.propertyModel.findByIdAndDelete(id);

    return { message: 'Property deleted successfully' };
  }

  /**
   * Get featured properties
   */
  async getFeatured(limit: number = 10) {
    const properties = await this.propertyModel
      .find({
        featured: true,
        approvalStatus: 'approved',
        status: Status.ACTIVE,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('ownerId', 'email')
      .exec();

    return properties;
  }

  /**
   * Search properties
   */
  async search(searchQuery: string, filters: any = {}) {
    const { page = 1, limit = 20 } = filters;

    const query: any = {
      approvalStatus: 'approved',
      status: Status.ACTIVE,
      $text: { $search: searchQuery },
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find(query)
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(Number(limit))
        .populate('ownerId', 'email')
        .exec(),
      this.propertyModel.countDocuments(query),
    ]);

    return {
      properties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Get nearby properties
   */
  async getNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
    limit: number = 10,
  ) {
    // Simple distance calculation (for MongoDB without geo indexes)
    const properties = await this.propertyModel
      .find({
        approvalStatus: 'approved',
        status: Status.ACTIVE,
        latitude: { $exists: true },
        longitude: { $exists: true },
      })
      .limit(limit * 3) // Get more to filter
      .populate('ownerId', 'email')
      .exec();

    // Calculate distances and filter
    const nearby = properties
      .map((property) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          property.latitude,
          property.longitude,
        );
        return { property, distance };
      })
      .filter((item) => item.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map((item) => ({
        ...item.property.toObject(),
        distance: item.distance,
      }));

    return nearby;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Get property statistics for owner
   */
  async getOwnerStats(ownerId: Types.ObjectId) {
    const [total, pending, approved, rejected, totalViews] = await Promise.all([
      this.propertyModel.countDocuments({ ownerId }),
      this.propertyModel.countDocuments({ ownerId, approvalStatus: 'pending' }),
      this.propertyModel.countDocuments({
        ownerId,
        approvalStatus: 'approved',
      }),
      this.propertyModel.countDocuments({
        ownerId,
        approvalStatus: 'rejected',
      }),
      this.propertyModel.aggregate([
        { $match: { ownerId: new Types.ObjectId(ownerId) } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } },
      ]),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      totalViews: totalViews[0]?.totalViews || 0,
    };
  }
}
