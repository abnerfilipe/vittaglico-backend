import { IsEmail, IsNotEmpty, MinLength, IsDateString } from 'class-validator';
import { EmailEhUnico } from '../validacao/email-eh-unico.validator';
import { UsernameEhUnico } from '../validacao/username-eh-unico.validator';

export class CriaUsuarioDTO {
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  nome: string;

  @IsNotEmpty({ message: 'O username não pode ser vazio' })
  @UsernameEhUnico({ message: 'Já existe um usuário com este username' })
  username: string;

  @IsEmail(undefined, { message: 'O e-mail informado é inválido' })
  @EmailEhUnico({ message: 'Já existe um usuário com este e-mail' })
  email: string;

  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres' })
  senha: string;

  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida (YYYY-MM-DD)' })
  dataDeNascimento: string;
}