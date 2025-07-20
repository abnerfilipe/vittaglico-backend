import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { EmailEhUnicoValidator } from './validacao/email-eh-unico.validator';
import { TelefoneEhUnicoValidator } from './validacao/telefone-eh-unico.validator';
import { TokenEntity } from '../auth/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario,TokenEntity]),
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService, 
    EmailEhUnicoValidator,
    TelefoneEhUnicoValidator,
  ],
  exports: [UsuarioService],
})
export class UsuarioModule {}
