import { Test, TestingModule } from '@nestjs/testing';
import { CriticsController } from './critics.controller';
import { CriticsService } from './critics.service';

describe('CriticsController', () => {
  let controller: CriticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CriticsController],
      providers: [CriticsService],
    }).compile();

    controller = module.get<CriticsController>(CriticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
