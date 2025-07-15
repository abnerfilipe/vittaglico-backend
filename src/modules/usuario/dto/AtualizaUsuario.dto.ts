import { PartialType } from '@nestjs/mapped-types';
import { CriaUsuarioDTO } from './CriaUsuario.dto';
import { IsOptional, IsNotEmpty, IsEmail, MinLength, IsDateString } from 'class-validator';
import { EmailEhUnico } from '../validacao/email-eh-unico.validator';
import { UsernameEhUnico } from '../validacao/username-eh-unico.validator';

export class AtualizaUsuarioDTO extends PartialType(CriaUsuarioDTO) {
  @IsOptional()
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  nome?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O username não pode ser vazio' })
  @UsernameEhUnico({ message: 'Já existe um usuário com este username' })
  username?: string;

  @IsOptional()
  @IsEmail(undefined, { message: 'O e-mail informado é inválido' })
  @EmailEhUnico({ message: 'Já existe um usuário com este e-mail' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres' })
  senha?: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida (YYYY-MM-DD)' })
  dataDeNascimento?: string;
}