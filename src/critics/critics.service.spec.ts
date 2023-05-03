import { Test, TestingModule } from '@nestjs/testing';
import { CriticsService } from './critics.service';

describe('CriticsService', () => {
  let service: CriticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CriticsService],
    }).compile();

    service = module.get<CriticsService>(CriticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
