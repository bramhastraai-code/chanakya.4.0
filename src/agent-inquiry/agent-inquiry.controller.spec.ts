import { Test, TestingModule } from '@nestjs/testing';
import { AgentInquiryController } from './agent-inquiry.controller';
import { AgentInquiryService } from './agent-inquiry.service';

describe('AgentInquiryController', () => {
  let controller: AgentInquiryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentInquiryController],
      providers: [AgentInquiryService],
    }).compile();

    controller = module.get<AgentInquiryController>(AgentInquiryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
