import { Test, TestingModule } from '@nestjs/testing';
import { GlicemiaController } from './glicemia.controller';
import { GlicemiaService } from './glicemia.service';

describe('GlicemiaController', () => {
  let controller: GlicemiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlicemiaController],
      providers: [GlicemiaService],
    }).compile();

    controller = module.get<GlicemiaController>(GlicemiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
