import { Module } from '@nestjs/common';
import { GlicemiaService } from './glicemia.service';
import { GlicemiaController } from './glicemia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { GlicemiaEntity } from './entities/glicemia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, GlicemiaEntity]),
  ],
  controllers: [GlicemiaController],
  providers: [GlicemiaService],
})
export class GlicemiaModule {}
