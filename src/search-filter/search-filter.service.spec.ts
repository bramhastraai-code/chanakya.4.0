import { Test, TestingModule } from '@nestjs/testing';
import { SearchFilterService } from './search-filter.service';

describe('SearchFilterService', () => {
  let service: SearchFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchFilterService],
    }).compile();

    service = module.get<SearchFilterService>(SearchFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
