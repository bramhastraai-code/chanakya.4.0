import { PartialType } from '@nestjs/swagger';
import { CreateAgentInquiryDto } from './create-agent-inquiry.dto';

export class UpdateAgentInquiryDto extends PartialType(CreateAgentInquiryDto) {}
