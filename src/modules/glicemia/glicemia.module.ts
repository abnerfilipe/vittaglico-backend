import { Module } from '@nestjs/common';
import { GlicemiaService } from './glicemia.service';
import { GlicemiaController } from './glicemia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { GlicemiaEntity } from './entities/glicemia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity, GlicemiaEntity]),
  ],
  controllers: [GlicemiaController],
  providers: [GlicemiaService],
})
export class GlicemiaModule {}
