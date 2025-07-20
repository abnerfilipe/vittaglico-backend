import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsulinaService } from './insulina.service';
import { InsulinaController } from './insulina.controller';
import { Insulina } from './entities/insulina.entity';
import { AplicacaoInsulina } from './entities/aplicacao-insulina.entity';
import { AplicacaoInsulinaService } from './aplicacao-insulina.service';
import { AplicacaoInsulinaController } from './aplicacao-insulina.controller';
import { Usuario } from '../usuario/entities/usuario.entity';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario,Insulina, AplicacaoInsulina]),
    AuthModule,
  ],
  controllers: [InsulinaController, AplicacaoInsulinaController],
  providers: [InsulinaService, AplicacaoInsulinaService],
  exports: [InsulinaService, AplicacaoInsulinaService],
})
export class InsulinaModule {}