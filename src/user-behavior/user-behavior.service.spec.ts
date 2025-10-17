import { Test, TestingModule } from '@nestjs/testing';
import { UserBehaviorService } from './user-behavior.service';

describe('UserBehaviorService', () => {
  let service: UserBehaviorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBehaviorService],
    }).compile();

    service = module.get<UserBehaviorService>(UserBehaviorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
