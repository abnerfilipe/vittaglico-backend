import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GlicemiaModule } from '../glicemia/glicemia.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { UsuarioService } from '../usuario/usuario.service';
import { AplicacaoInsulinaController } from './aplicacao-insulina.controller';
import { AplicacaoInsulina } from './entities/aplicacao-insulina.entity';
import { CorrecaoGlicemia } from './entities/correcao-glicemia.entity';
import { Insulina } from './entities/insulina.entity';
import { InsulinaController } from './insulina.controller';
import { AplicacaoInsulinaService } from './services/aplicacao-insulina.service';
import { CalculadoraCorrecaoGlicemiaService } from './services/calculadora-correcao-glicemia.service';
import { InsulinaService } from './services/insulina.service';
import { Usuario } from '../usuario/entities/usuario.entity';
import { TokenEntity } from '../auth/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Insulina, 
      AplicacaoInsulina,
      CorrecaoGlicemia,
      Usuario,    
      TokenEntity 
    ]),
    AuthModule,
    UsuarioModule,  
    GlicemiaModule, 
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