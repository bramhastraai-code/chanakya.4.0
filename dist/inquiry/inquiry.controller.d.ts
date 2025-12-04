import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { Response } from 'src/common/interceptor/response.interface';
export declare class InquiryController {
    private readonly inquiryService;
    constructor(inquiryService: InquiryService);
    create(createInquiryDto: CreateInquiryDto): Promise<Response<Inquiry>>;
    update(id: string, updateInquiryDto: UpdateInquiryDto): Promise<Inquiry>;
    findAll(pageSize?: string, pageNumber?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, inquiryType?: 'common' | 'groupBuy' | 'agentSelection' | 'quickBuy' | 'siteVisit', status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED', projectId?: string, propertyId?: string, builderId?: string): Promise<Response<{
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
}
