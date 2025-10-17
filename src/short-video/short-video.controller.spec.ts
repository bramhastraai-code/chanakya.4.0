import { Test, TestingModule } from '@nestjs/testing';
import { ShortVideoController } from './short-video.controller';
import { ShortVideoService } from './short-video.service';

describe('ShortVideoController', () => {
  let controller: ShortVideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortVideoController],
      providers: [ShortVideoService],
    }).compile();

    controller = module.get<ShortVideoController>(ShortVideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
