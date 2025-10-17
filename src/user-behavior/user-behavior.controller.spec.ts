import { Test, TestingModule } from '@nestjs/testing';
import { UserBehaviorController } from './user-behavior.controller';
import { UserBehaviorService } from './user-behavior.service';

describe('UserBehaviorController', () => {
  let controller: UserBehaviorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBehaviorController],
      providers: [UserBehaviorService],
    }).compile();

    controller = module.get<UserBehaviorController>(UserBehaviorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
