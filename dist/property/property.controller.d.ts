import { Types } from 'mongoose';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { S3Service } from 'src/s3/s3.service';
import { Response } from 'src/common/interceptor/response.interface';
import { Status } from 'src/common/enum/status.enum';
export declare class PropertyController {
    private readonly propertyService;
    private readonly s3Service;
    private readonly logger;
    constructor(propertyService: PropertyService, s3Service: S3Service);
    getPropertiesByCreator(user: any, pageSize: string, pageNumber: string, searchQuery?: string, status?: string): Promise<Response<{
        properties: Property[];
        totalPages: number;
        totalProperties: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<Response<{
        properties: Property[];
        totalPages: number;
        totalProperties: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<{
        data: Property;
        message: string;
    }>;
    create(createPropertyDto: CreatePropertyDto, user: any): Promise<{
        data: Property;
        message: string;
    }>;
    update(id: string, updatePropertyDto: UpdatePropertyDto, user: any): Promise<{
        data: Property;
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getPropertySummaries(): Promise<Response<Property[]>>;
    getPropertyById(id: string): Promise<Response<any>>;
    getPropertyByCity(city: string): Promise<Response<any>>;
    getFormattedProperties(res: any): Promise<any>;
}
export declare class UserPropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    findAll(page?: number, limit?: number, search?: string, city?: string, state?: string, propertyType?: string, propertyPurpose?: string, minPrice?: number, maxPrice?: number, bedrooms?: number, bathrooms?: number, minArea?: number, maxArea?: number, featured?: boolean, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        data: {
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
        };
        message: string;
    }>;
    findOne(id: string): Promise<{
        data: import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
}
export declare class AgentPropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    getBuilderProperties(user: any, page?: number, limit?: number, status?: Status, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        data: {
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
        };
        message: string;
    }>;
    getMyStats(user: any): Promise<{
        data: {
            total: number;
            pending: number;
            approved: number;
            rejected: number;
            totalViews: any;
        };
        message: string;
    }>;
    create(createPropertyDto: CreatePropertyDto, user: any): Promise<{
        data: import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
    update(id: string, updatePropertyDto: UpdatePropertyDto, user: any): Promise<{
        data: Property;
        message: string;
    }>;
    remove(id: string, user: any): Promise<{
        data: any;
        message: string;
    }>;
    bookmarkProperty(id: string, user: any): Promise<{
        data: {
            message: string;
        };
        message: string;
    }>;
    removeBookmark(id: string, user: any): Promise<{
        data: {
            message: string;
        };
        message: string;
    }>;
    getBookmarkedProperties(user: any, page?: number, limit?: number): Promise<{
        data: {
            properties: any[];
            pagination: {
                currentPage: number;
                totalPages: number;
                totalItems: number;
                itemsPerPage: number;
            };
        };
        message: string;
    }>;
    getTopLocations(limit?: number): Promise<{
        data: {
            city: any;
            propertyCount: any;
            averagePrice: number;
        }[];
        message: string;
    }>;
    getNearbyProperties(id: string, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        message: string;
    }>;
    getRecommendations(user: any, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        message: string;
    }>;
}
export declare class BuilderPropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    getBuilderProperties(user: any, page?: number, limit?: number, status?: Status, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        data: {
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
        };
        message: string;
    }>;
    create(createPropertyDto: CreatePropertyDto, user: any): Promise<{
        data: import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
}
export declare class AdminPropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    getPendingProperties(page?: number, limit?: number): Promise<{
        data: {
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
        };
        message: string;
    }>;
    getStats(): Promise<{
        data: {
            pending: number;
            approved: number;
            rejected: number;
            total: number;
        };
        message: string;
    }>;
    approve(id: string, user: any): Promise<{
        data: import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
    reject(id: string, reason: string, user: any): Promise<{
        data: import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
    getAllProperties(page?: number, limit?: number, status?: Status, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        data: {
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
        };
        message: string;
    }>;
    createProperty(createPropertyDto: any, user: any): Promise<{
        data: import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
    updateProperty(id: string, updatePropertyDto: any, user: any): Promise<{
        data: import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
    deleteProperty(id: string): Promise<{
        data: any;
        message: string;
    }>;
}
export declare class PublicPropertiesController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    findAll(filters: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
    getFeatured(limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        message: string;
    }>;
    search(query: string, filters: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
    getNearby(latitude: number, longitude: number, radius?: number, limit?: number): Promise<{
        data: {
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
        }[];
        message: string;
    }>;
    findOne(id: string): Promise<{
        data: import("mongoose").Document<unknown, {}, Property, {}, {}> & Property & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
}
