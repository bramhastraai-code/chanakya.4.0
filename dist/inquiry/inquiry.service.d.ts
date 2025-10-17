/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model, Types } from 'mongoose';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateBrokerInquiryDto, UpdateInquiryDto } from './dto/update-inquiry.dto';
import { Customer } from 'src/customer/entities/customer.entity';
import { CreateBrokerInquiryDto } from './dto/create-agent-inquiry.dto';
export declare class InquiryService {
    private readonly inquiryModel;
    private customerModel;
    constructor(inquiryModel: Model<Inquiry>, customerModel: Model<Customer>);
    create(createInquiryDto: CreateInquiryDto): Promise<Inquiry>;
    update(id: string, updateInquiryDto: UpdateInquiryDto): Promise<Inquiry | null>;
    findAll(pageSize?: string, pageNumber?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, inquiryType?: 'common' | 'groupBuy' | 'agentSelection' | 'quickBuy' | 'siteVisit', status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'): Promise<{
        inquiries: Inquiry[];
        totalPages: number;
        totalInquiries: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Inquiry | null>;
    remove(id: string): Promise<{
        deletedCount: number;
    }>;
    findByCustomerId(customerId: string, pageSize?: string, pageNumber?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        inquiries: Omit<Omit<import("mongoose").Document<unknown, {}, Inquiry> & Inquiry & {
            _id: Types.ObjectId;
        }, never>, never>[];
        totalPages: number;
        totalInquiries: number;
        pageSize: number;
        pageNumber: number;
    }>;
    createInquiry(createInquiryDto: CreateBrokerInquiryDto, agentId: string): Promise<import("mongoose").Document<unknown, {}, Inquiry> & Inquiry & {
        _id: Types.ObjectId;
    }>;
    updateInquiry(id: string, updateInquiryDto: UpdateBrokerInquiryDto, agentId: string): Promise<import("mongoose").Document<unknown, {}, Inquiry> & Inquiry & {
        _id: Types.ObjectId;
    }>;
}
