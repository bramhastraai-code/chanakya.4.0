import { Model } from 'mongoose';
import { AgentInquiry } from './entities/agent-inquiry.entity';
import { CreateAgentInquiryDto } from './dto/create-agent-inquiry.dto';
import { UpdateAgentInquiryDto } from './dto/update-agent-inquiry.dto';
import { Status } from 'src/common/enum/status.enum';
export declare class AgentInquiryService {
    private agentInquiryModel;
    constructor(agentInquiryModel: Model<AgentInquiry>);
    findAll(pageSize: string, pageNumber: string, sortBy: string, sortOrder: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<{
        inquiries: (import("mongoose").Document<unknown, {}, AgentInquiry, {}, {}> & AgentInquiry & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        totalPages: number;
        totalInquiries: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<AgentInquiry>;
    create(createAgentInquiryDto: CreateAgentInquiryDto): Promise<AgentInquiry>;
    update(id: string, updateAgentInquiryDto: UpdateAgentInquiryDto): Promise<AgentInquiry>;
    remove(id: string): Promise<AgentInquiry>;
    addAgentForm(createAgentInquiryDto: CreateAgentInquiryDto): Promise<AgentInquiry>;
}
