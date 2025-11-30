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
import { Model } from 'mongoose';
import { AgentInquiry } from './entities/agent-inquiry.entity';
import { CreateAgentInquiryDto } from './dto/create-agent-inquiry.dto';
import { UpdateAgentInquiryDto } from './dto/update-agent-inquiry.dto';
import { Status } from 'src/common/enum/status.enum';
export declare class AgentInquiryService {
    private agentInquiryModel;
    constructor(agentInquiryModel: Model<AgentInquiry>);
    findAll(pageSize: string, pageNumber: string, sortBy: string, sortOrder: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<{
        inquiries: (import("mongoose").Document<unknown, {}, AgentInquiry> & AgentInquiry & {
            _id: import("mongoose").Types.ObjectId;
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
