import { Model, Types } from 'mongoose';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
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
export declare class PropertyService {
    private propertyModel;
    private bookmarkedPropertyModel;
    private readonly logger;
    constructor(propertyModel: Model<Property>, bookmarkedPropertyModel: Model<BookmarkedProperty>);
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<{
        properties: Property[];
        totalPages: number;
        totalProperties: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Property>;
    findOneWithDetails(id: string): Promise<import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto, userId?: string): Promise<Property>;
    remove(id: string): Promise<void>;
    findPropertiesByCreator(creatorId: string, pageSize: string, pageNumber: string, searchQuery?: string, status?: string): Promise<{
        properties: Property[];
        totalPages: number;
        totalProperties: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findByOwner(ownerId: Types.ObjectId, filters?: any): Promise<{
        properties: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOwnerStats(ownerId: Types.ObjectId): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        totalViews: any;
    }>;
    findAgentProperties(agentId: string, page: number, limit: number, status?: Status, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        properties: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
    createProperty(createPropertyDto: CreatePropertyDto, agentId: string): Promise<import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findBuilderProperties(builderId: string, page: number, limit: number, status?: Status, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        properties: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
    createBuilderProperty(createPropertyDto: CreatePropertyDto, builderId: string): Promise<import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAllForAdmin(page: number, limit: number, status?: Status, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        properties: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
        stats: {
            total: number;
            active: number;
            pending: number;
            totalViews: any;
        };
    }>;
    findPendingProperties(page: number, limit: number): Promise<{
        properties: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
    approveProperty(id: string, adminId: string): Promise<import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    rejectProperty(id: string, reason: string, adminId: string): Promise<import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createPropertyAsAdmin(createPropertyDto: any, adminId: string): Promise<import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updatePropertyAsAdmin(id: string, updatePropertyDto: any, adminId: string): Promise<import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deletePropertyAsAdmin(id: string): Promise<{
        deleted: boolean;
    }>;
    private getPropertyStats;
    getPendingApprovals(page?: number, limit?: number): Promise<{
        properties: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getApprovalStats(): Promise<{
        pending: number;
        approved: number;
        rejected: number;
        total: number;
    }>;
    findAllWithFilters(options: FilterOptions): Promise<{
        properties: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findAllApproved(filters?: any): Promise<{
        properties: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    search(searchQuery: string, filters?: any): Promise<{
        properties: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPropertiesByProjectId(projectId: string): Promise<Property[]>;
    getPropertiesByCity(city: string): Promise<Property[]>;
    getFeatured(limit?: number): Promise<(import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPropertySummaries(): Promise<Property[]>;
    getFormattedProperties(): Promise<any[]>;
    getTopLocations(limit?: number): Promise<{
        city: any;
        propertyCount: any;
        averagePrice: number;
    }[]>;
    getNearbyProperties(propertyId: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getNearby(latitude: number, longitude: number, radiusKm?: number, limit?: number): Promise<{
        distance: number;
        thumbnail: string;
        propertyTitle: string;
        propertyDescription?: string;
        propertyOwner?: string;
        OwnerContactNumber?: string;
        propertyExecutive?: string;
        propertyType?: import("./enum/property.enum").PropertyType;
        propertyPurpose?: import("./enum/property.enum").PropertyPurpose;
        propertyStatus?: import("./enum/property.enum").PropertyStatus;
        propertyCategory?: import("./enum/property.enum").PropertyCategory;
        bhkConfiguration?: import("./enum/property.enum").BHKConfiguration;
        furnishingStatus?: import("./enum/property.enum").FurnishingStatus;
        propertyAge?: number;
        propertyAgeMonth?: number;
        totalArea?: number;
        carpetArea?: number;
        balconyCount?: number;
        bathroomCount?: number;
        bedCount?: number;
        parkingCount?: number;
        floorNumber?: number;
        totalFloors?: number;
        facingDirection?: import("./enum/property.enum").FacingDirection;
        amenities?: Types.Array<Types.ObjectId>;
        facilities?: Types.Array<Types.ObjectId>;
        address?: string;
        city?: string;
        state?: string;
        region?: string;
        landmark?: string;
        roadDistance?: number;
        latitude?: number;
        longitude?: number;
        country?: string;
        pinCode?: string;
        price?: number;
        pricePerUnit?: number;
        maintenanceCharge?: number;
        deposit?: number;
        totalPrice?: number;
        images?: string[];
        videoLink?: string;
        floorPlan?: string;
        masterPlan?: string;
        seoTitle?: string;
        seoDescription?: string;
        seoKeywords?: string[];
        plotType?: import("./enum/property.enum").PlotType;
        pgAvailableFor?: import("./enum/property.enum").PGAvailableFor;
        tags?: {
            text: string;
            variant: import("./enum/property.enum").TagVariant;
            iconUrl: string;
        }[];
        offers: {
            text: string;
            variant: import("./enum/property.enum").OfferVariant;
            description: string;
        }[];
        featured?: boolean;
        builderId?: Types.ObjectId;
        projectId?: import("../project/entities/project.entity").Project;
        ownerId: Types.ObjectId;
        customer?: Types.ObjectId;
        createdBy?: Types.ObjectId;
        updatedBy?: Types.ObjectId;
        approvalStatus: string;
        approvalNotes?: string;
        rejectionReason?: string;
        approvedBy?: Types.ObjectId;
        approvedAt?: Date;
        views?: number;
        status?: Status;
        nearby?: Array<{
            resource: string;
            distance: number;
        }>;
        createdAt: Date;
        updatedAt: Date;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }[]>;
    private calculateDistance;
    private toRad;
    bookmarkProperty(agentId: string, propertyId: string): Promise<{
        message: string;
    }>;
    removeBookmark(agentId: string, propertyId: string): Promise<{
        message: string;
    }>;
    getBookmarkedProperties(agentId: string, page: number, limit: number): Promise<{
        properties: any[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
    getRecommendations(agentId: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    incrementViews(id: string): Promise<void>;
    findOneApproved(id: string): Promise<import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createWeb(createPropertyDto: CreatePropertyDto): Promise<Property>;
    createForOwner(ownerId: Types.ObjectId, dto: any): Promise<import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateForOwner(id: string, ownerId: Types.ObjectId, dto: any): Promise<Property>;
    deleteForOwner(id: string, ownerId: Types.ObjectId): Promise<{
        message: string;
    }>;
}
export {};
