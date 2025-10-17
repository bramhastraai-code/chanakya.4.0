import { Test, TestingModule } from '@nestjs/testing';
import { AgentInquiryService } from './agent-inquiry.service';

describe('AgentInquiryService', () => {
  let service: AgentInquiryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentInquiryService],
    }).compile();

    service = module.get<AgentInquiryService>(AgentInquiryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
