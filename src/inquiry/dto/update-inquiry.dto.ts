import { PartialType } from '@nestjs/swagger';
import { CreateInquiryDto } from './create-inquiry.dto';
import { CreateBrokerInquiryDto } from './create-agent-inquiry.dto';

export class UpdateInquiryDto extends PartialType(CreateInquiryDto) {}

export class UpdateBrokerInquiryDto extends PartialType(
  CreateBrokerInquiryDto,
) {}
