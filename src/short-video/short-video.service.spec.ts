import { Test, TestingModule } from '@nestjs/testing';
import { ShortVideoService } from './short-video.service';

describe('ShortVideoService', () => {
  let service: ShortVideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortVideoService],
    }).compile();

    service = module.get<ShortVideoService>(ShortVideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
