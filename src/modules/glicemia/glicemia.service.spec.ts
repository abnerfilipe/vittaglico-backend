import { Test, TestingModule } from '@nestjs/testing';
import { GlicemiaService } from './glicemia.service';

describe('GlicemiaService', () => {
  let service: GlicemiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlicemiaService],
    }).compile();

    service = module.get<GlicemiaService>(GlicemiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
