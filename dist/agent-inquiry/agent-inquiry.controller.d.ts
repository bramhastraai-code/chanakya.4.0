import { AgentInquiryService } from './agent-inquiry.service';
import { CreateAgentInquiryDto } from './dto/create-agent-inquiry.dto';
import { UpdateAgentInquiryDto } from './dto/update-agent-inquiry.dto';
import { AgentInquiry } from './entities/agent-inquiry.entity';
import { Response } from 'src/common/interceptor/response.interface';
import { Status } from 'src/common/enum/status.enum';
export declare class AgentInquiryController {
    private readonly agentInquiryService;
    constructor(agentInquiryService: AgentInquiryService);
    findAll(pageSize: string, pageNumber: string, sortBy: string, sortOrder: 'desc' | 'asc', searchQuery?: string, status?: Status): Promise<Response<{
        inquiries: AgentInquiry[];
        totalPages: number;
        totalInquiries: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<AgentInquiry>>;
    create(createAgentInquiryDto: CreateAgentInquiryDto): Promise<Response<AgentInquiry>>;
    update(id: string, updateAgentInquiryDto: UpdateAgentInquiryDto): Promise<Response<AgentInquiry>>;
    remove(id: string): Promise<Response<AgentInquiry>>;
    addAgentForm(createAgentInquiryDto: CreateAgentInquiryDto): Promise<Response<AgentInquiry>>;
}
