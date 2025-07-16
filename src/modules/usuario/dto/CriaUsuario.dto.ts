import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsDateString, IsString, Length } from 'class-validator';
import { EmailEhUnico } from '../validacao/email-eh-unico.validator';
import { UsernameEhUnico } from '../validacao/username-eh-unico.validator';
import { TelefoneEhUnico } from '../validacao/telefone-eh-unico.validator';

export class CriaUsuarioDTO {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    required: true
  })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  nome: string;

  @ApiProperty({
    description: 'Nome de usuário único para login (entre 4 e 15 caracteres)',
    example: 'joao123',
    required: true,
    minLength: 4,
    maxLength: 15
  })
  @IsNotEmpty({ message: 'O username não pode ser vazio' })
  @UsernameEhUnico({ message: 'Já existe um usuário com este username' })
  username: string;

  @ApiProperty({
    description: 'Endereço de email único do usuário',
    example: 'joao@email.com',
    required: true,
    format: 'email'
  })
  @IsEmail(undefined, { message: 'O e-mail informado é inválido' })
  @EmailEhUnico({ message: 'Já existe um usuário com este e-mail' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
    required: true,
    minLength: 6,
    writeOnly: true
  })
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres' })
  senha: string;

  @ApiProperty({
    description: 'Número de telefone do usuário (entre 10 e 11 caracteres)',
    example: '11123456789',
    required: true,
    minLength: 10,
    maxLength: 11
  })
  @IsNotEmpty({ message: 'O telefone não pode ser vazio' })
  @IsString()
  @Length(10, 11, { message: 'O telefone deve ter entre 10 e 11 caracteres' })
  @TelefoneEhUnico({ message: 'Já existe um usuário com este telefone' })
  telefone: string;

  @ApiProperty({
    description: 'Data de nascimento no formato YYYY-MM-DD',
    example: '1990-01-01',
    required: true,
    format: 'date'
  })
  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida (YYYY-MM-DD)' })
  dataDeNascimento: string;
}