import { Test, TestingModule } from '@nestjs/testing';
import { SearchFilterController } from './search-filter.controller';
import { SearchFilterService } from './search-filter.service';

describe('SearchFilterController', () => {
  let controller: SearchFilterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchFilterController],
      providers: [SearchFilterService],
    }).compile();

    controller = module.get<SearchFilterController>(SearchFilterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
