import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsulinaService } from './services/insulina.service';
import { InsulinaController } from './insulina.controller';
import { Insulina } from './entities/insulina.entity';
import { AplicacaoInsulina } from './entities/aplicacao-insulina.entity';
import { AplicacaoInsulinaService } from './services/aplicacao-insulina.service';
import { AplicacaoInsulinaController } from './aplicacao-insulina.controller';
import { Usuario } from '../usuario/entities/usuario.entity';
import { AuthModule } from '../auth/auth.module';
import { CalculadoraCorrecaoGlicemiaService } from './services/calculadora-correcao-glicemia.service';
import { Glicemia } from '../glicemia/entities/glicemia.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { GlicemiaModule } from '../glicemia/glicemia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Glicemia, Insulina, AplicacaoInsulina]),
    AuthModule,
    UsuarioModule,  // Importar o UsuarioModule
    GlicemiaModule, // Importar o GlicemiaModule
  ],
  controllers: [
    InsulinaController, 
    AplicacaoInsulinaController
  ],
  providers: [
    InsulinaService, 
    AplicacaoInsulinaService,
    CalculadoraCorrecaoGlicemiaService,
  ],
  exports: [InsulinaService, AplicacaoInsulinaService, CalculadoraCorrecaoGlicemiaService],
})
export class InsulinaModule {}