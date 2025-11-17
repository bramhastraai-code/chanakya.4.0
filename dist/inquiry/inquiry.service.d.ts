import { Model } from 'mongoose';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { Customer } from 'src/customer/entities/customer.entity';
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
}
