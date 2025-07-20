import { Test, TestingModule } from '@nestjs/testing';
import { InsulinaController } from './insulina.controller';
import { InsulinaService } from './insulina.service';

describe('InsulinaController', () => {
  let controller: InsulinaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsulinaController],
      providers: [InsulinaService],
    }).compile();

    controller = module.get<InsulinaController>(InsulinaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
