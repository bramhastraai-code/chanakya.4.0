import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Amenity } from 'src/amenity/entities/amenity.entity';
import { Status } from 'src/common/enum/status.enum';
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

/**
 * Unified Property Service
 * Combines all property-related operations from multiple service files
 */
@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name);

  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    @InjectModel(BookmarkedProperty.name)
    private bookmarkedPropertyModel: Model<BookmarkedProperty>,
  ) {}

  // ==================== BASIC CRUD OPERATIONS ====================

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
    const page = parseInt(pageNumber, 10) || 1;
    const size = parseInt(pageSize, 10) || 10;
    const skip = (page - 1) * size;

    this.logger.log(
      `Fetching properties - Page: ${page}, Size: ${size}, Status: ${status || 'all'}`,
    );

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
        strictPopulate: false,
      })
      .populate({
        path: 'createdBy',
        strictPopulate: false,
      })
      .populate({
        path: 'updatedBy',
        strictPopulate: false,
      })
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

    return {
      properties,
      totalProperties,
      totalPages,
      pageSize: size,
      pageNumber: page,
    };
  }

  async findOne(id: string): Promise<Property> {
    this.logger.log(`Fetching property with ID: ${id}`);

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
        strictPopulate: false,
      })
      .populate({
        path: 'createdBy',
        strictPopulate: false,
      })
      .populate({
        path: 'updatedBy',
        strictPopulate: false,
      })
      .exec();

    if (!property) {
      throw new NotFoundException(`Property with ID '${id}' not found`);
    }

    return property;
  }

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

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    this.logger.log(`Creating property: ${createPropertyDto.propertyTitle}`);

    const createdProperty = new this.propertyModel(createPropertyDto);
    return await createdProperty.save();
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    userId?: string,
  ): Promise<Property> {
    this.logger.log(`Updating property with ID: ${id}`);

    const updateData = userId
      ? { ...updatePropertyDto, updatedBy: userId }
      : updatePropertyDto;

    const updatedProperty = await this.propertyModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedProperty) {
      throw new NotFoundException(`Property with ID '${id}' not found`);
    }

    return updatedProperty;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting property with ID: ${id}`);

    const property = await this.propertyModel.findById(id).exec();

    if (!property) {
      throw new NotFoundException(`Property with ID '${id}' not found`);
    }

    await this.propertyModel.findByIdAndDelete(id).exec();
  }

  // ==================== CREATOR/OWNER OPERATIONS ====================

  async findPropertiesByCreator(
    creatorId: string,
    pageSize: string,
    pageNumber: string,
    searchQuery?: string,
    status?: string,
  ): Promise<{
    properties: Property[];
    totalPages: number;
    totalProperties: number;
    pageSize: number;
    pageNumber: number;
  }> {
    const page = parseInt(pageNumber, 10) || 1;
    const size = parseInt(pageSize, 10) || 10;
    const skip = (page - 1) * size;

    this.logger.log(`Fetching properties by creator: ${creatorId}`);

    const query: any = { createdBy: creatorId };

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
        strictPopulate: false,
      })
      .populate({
        path: 'createdBy',
        strictPopulate: false,
      })
      .populate({
        path: 'updatedBy',
        strictPopulate: false,
      })
      .sort({ createdAt: -1 });

    return {
      properties,
      totalProperties,
      totalPages,
      pageSize: size,
      pageNumber: page,
    };
  }

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

  // ==================== AGENT OPERATIONS ====================

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

  // ==================== BUILDER OPERATIONS ====================

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

  // ==================== ADMIN OPERATIONS ====================

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
    property.approvalStatus = 'approved';
    property.approvedBy = adminId as any;
    property.approvedAt = new Date();

    await property.save();

    return property;
  }

  async rejectProperty(id: string, reason: string, adminId: string) {
    const property = await this.propertyModel.findById(id);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    property.status = Status.IN_ACTIVE;
    property.updatedBy = adminId as any;
    property.approvalStatus = 'rejected';
    property.approvedBy = adminId as any;
    property.approvedAt = new Date();
    property.rejectionReason = reason;

    await property.save();

    return property;
  }

  async createPropertyAsAdmin(createPropertyDto: any, adminId: string) {
    const property = await this.propertyModel.create({
      ...createPropertyDto,
      createdBy: adminId,
      updatedBy: adminId,
      status: Status.ACTIVE, // Admin-created properties are auto-approved
      approvalStatus: 'approved',
    });

    return property;
  }

  async updatePropertyAsAdmin(
    id: string,
    updatePropertyDto: any,
    adminId: string,
  ) {
    const property = await this.propertyModel.findById(id);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    Object.assign(property, updatePropertyDto);
    property.updatedBy = adminId as any;

    await property.save();

    return property;
  }

  async deletePropertyAsAdmin(id: string) {
    const property = await this.propertyModel.findById(id);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    await this.propertyModel.findByIdAndDelete(id);

    return { deleted: true };
  }

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

  // ==================== APPROVAL OPERATIONS ====================

  async getPendingApprovals(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find({ approvalStatus: 'pending' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('ownerId', 'email')
        .exec(),
      this.propertyModel.countDocuments({ approvalStatus: 'pending' }),
    ]);

    return {
      properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getApprovalStats() {
    const [pending, approved, rejected, total] = await Promise.all([
      this.propertyModel.countDocuments({ approvalStatus: 'pending' }),
      this.propertyModel.countDocuments({ approvalStatus: 'approved' }),
      this.propertyModel.countDocuments({ approvalStatus: 'rejected' }),
      this.propertyModel.countDocuments(),
    ]);

    return {
      pending,
      approved,
      rejected,
      total,
    };
  }

  // ==================== FILTERING & SEARCH OPERATIONS ====================

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

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { propertyTitle: { $regex: search, $options: 'i' } },
        { propertyDescription: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }
    if (propertyPurpose) {
      query.propertyPurpose = propertyPurpose;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    if (bedrooms !== undefined) {
      query.bedCount = bedrooms;
    }
    if (bathrooms !== undefined) {
      query.bathroomCount = bathrooms;
    }

    if (minArea !== undefined || maxArea !== undefined) {
      query.totalArea = {};
      if (minArea !== undefined) query.totalArea.$gte = minArea;
      if (maxArea !== undefined) query.totalArea.$lte = maxArea;
    }

    if (featured !== undefined) {
      query.featured = featured;
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

  async search(searchQuery: string, filters: any = {}) {
    const { page = 1, limit = 20 } = filters;

    const query: any = {
      approvalStatus: 'approved',
      status: Status.ACTIVE,
      $or: [
        { propertyTitle: { $regex: searchQuery, $options: 'i' } },
        { propertyDescription: { $regex: searchQuery, $options: 'i' } },
        { address: { $regex: searchQuery, $options: 'i' } },
      ],
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find(query)
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

  // ==================== SPECIALIZED QUERY OPERATIONS ====================

  async getPropertiesByProjectId(projectId: string): Promise<Property[]> {
    const properties = await this.propertyModel
      .find({ projectId })
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
        strictPopulate: false,
      })
      .exec();

    this.logger.log(
      `Found ${properties.length} properties for project: ${projectId}`,
    );

    if (!properties || properties.length === 0) {
      return [];
    }
    return properties;
  }

  async getPropertiesByCity(city: string): Promise<Property[]> {
    const properties = await this.propertyModel
      .find({ city })
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
        strictPopulate: false,
      })
      .exec();

    this.logger.log(`Found ${properties.length} properties in city: ${city}`);

    if (!properties || properties.length === 0) {
      return [];
    }
    return properties;
  }

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

  async getPropertySummaries(): Promise<Property[]> {
    const properties = await this.propertyModel
      .find(
        {},
        'thumbnail propertyTitle address price propertyStatus totalArea bedCount pricePerUnit tags featured amenities',
      )
      .populate({
        path: 'amenities',
        model: Amenity.name,
        select: 'name iconImage',
        strictPopulate: false,
      })
      .populate({
        path: 'facilities',
        model: Amenity.name,
        select: 'name iconImage',
        strictPopulate: false,
      })
      .exec();

    if (!properties.length) {
      throw new NotFoundException('No properties found.');
    }
    return properties;
  }

  async getFormattedProperties(): Promise<any[]> {
    const properties = await this.propertyModel
      .aggregate([
        {
          $group: {
            _id: {
              city: '$city',
              region: '$region',
            },
            properties: {
              $push: {
                _id: '$_id',
                title: '$propertyTitle',
                imageURL: { $arrayElemAt: ['$images', 0] },
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

  async getNearbyProperties(propertyId: string, limit: number = 10) {
    const property = await this.propertyModel.findById(propertyId);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

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

  async getNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
    limit: number = 10,
  ) {
    const properties = await this.propertyModel
      .find({
        approvalStatus: 'approved',
        status: Status.ACTIVE,
        latitude: { $exists: true },
        longitude: { $exists: true },
      })
      .limit(limit * 3)
      .populate('ownerId', 'email')
      .exec();

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

  // ==================== BOOKMARK OPERATIONS ====================

  async bookmarkProperty(agentId: string, propertyId: string) {
    const property = await this.propertyModel.findById(propertyId);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

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

  async getBookmarkedProperties(agentId: string, page: number, limit: number) {
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

  async getRecommendations(agentId: string, limit: number = 10) {
    const bookmarks = await this.bookmarkedPropertyModel
      .find({ agent: agentId })
      .populate('property')
      .limit(5)
      .exec();

    if (bookmarks.length === 0) {
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

    const properties = bookmarks.map((b: any) => b.property);
    const cities = [...new Set(properties.map((p: any) => p.city))];
    const propertyTypes = [
      ...new Set(properties.map((p: any) => p.propertyType)),
    ];

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

  // ==================== UTILITY OPERATIONS ====================

  async incrementViews(id: string): Promise<void> {
    await this.propertyModel.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    });
  }

  async findOneApproved(id: string) {
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

    if (property.approvalStatus !== 'approved') {
      throw new NotFoundException('Property not found');
    }

    await this.incrementViews(id);

    return property;
  }

  async createWeb(createPropertyDto: CreatePropertyDto): Promise<Property> {
    this.logger.log(
      `Creating property via web: ${createPropertyDto.propertyTitle}`,
    );

    const createdProperty = new this.propertyModel(createPropertyDto);
    return await createdProperty.save();
  }

  async createForOwner(ownerId: Types.ObjectId, dto: any) {
    const property = await this.propertyModel.create({
      ...dto,
      ownerId,
      createdBy: ownerId,
      approvalStatus: 'pending',
      status: Status.ACTIVE,
    });

    return property;
  }

  async updateForOwner(id: string, ownerId: Types.ObjectId, dto: any) {
    const property = await this.findOne(id);

    if (property.ownerId?.toString() !== ownerId.toString()) {
      throw new ForbiddenException('You can only update your own properties');
    }

    Object.assign(property, dto);
    property.updatedBy = ownerId;
    await property.save();

    return property;
  }

  async deleteForOwner(id: string, ownerId: Types.ObjectId) {
    const property = await this.findOne(id);

    if (property.ownerId?.toString() !== ownerId.toString()) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    await this.propertyModel.findByIdAndDelete(id);

    return { message: 'Property deleted successfully' };
  }
}
