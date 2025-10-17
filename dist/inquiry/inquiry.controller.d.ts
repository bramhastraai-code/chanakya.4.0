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
import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { CreateBrokerInquiryDto } from './dto/create-agent-inquiry.dto';
import { Types } from 'mongoose';
export declare class InquiryController {
    private readonly inquiryService;
    constructor(inquiryService: InquiryService);
    create(createInquiryDto: CreateInquiryDto): Promise<Response<Inquiry>>;
    update(id: string, updateInquiryDto: UpdateInquiryDto): Promise<Inquiry>;
    findAll(pageSize?: string, pageNumber?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, inquiryType?: 'common' | 'groupBuy' | 'agentSelection' | 'quickBuy' | 'siteVisit', status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'): Promise<Response<{
        inquiries: Inquiry[];
        totalPages: number;
        totalInquiries: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<Inquiry>>;
    remove(id: string): Promise<{
        data: string;
        message: string;
    }>;
    findByCustomerId(customerId: string, pageSize?: string, pageNumber?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<Response<{
        inquiries: Inquiry[];
        totalPages: number;
        totalInquiries: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    createByAgent(createInquiryDto: CreateBrokerInquiryDto, req: any): Promise<{
        data: import("mongoose").Document<unknown, {}, Inquiry> & Inquiry & {
            _id: Types.ObjectId;
        };
        message: string;
    }>;
    updateByAgent(id: string, updateInquiryDto: UpdateInquiryDto, req: any): Promise<{
        data: import("mongoose").Document<unknown, {}, Inquiry> & Inquiry & {
            _id: Types.ObjectId;
        };
        message: string;
    }>;
}
