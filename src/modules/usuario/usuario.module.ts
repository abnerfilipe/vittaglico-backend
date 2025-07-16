import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from './usuario.controller';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { EmailEhUnicoValidator } from './validacao/email-eh-unico.validator';
import { TelefoneEhUnicoValidator } from './validacao/telefone-eh-unico.validator';
import { UsernameEhUnicoValidator } from './validacao/username-eh-unico.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity]),
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService, 
    EmailEhUnicoValidator,
    TelefoneEhUnicoValidator,
    UsernameEhUnicoValidator,
  ],
  exports: [UsuarioService],
})
export class UsuarioModule {}
