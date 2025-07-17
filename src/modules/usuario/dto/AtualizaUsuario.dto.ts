import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { EmailEhUnico } from '../validacao/email-eh-unico.validator';
import { TelefoneEhUnico } from '../validacao/telefone-eh-unico.validator';
import { CriaUsuarioDTO } from './CriaUsuario.dto';

export class AtualizaUsuarioDTO extends PartialType(CriaUsuarioDTO) {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    required: false
  })
  @IsOptional()
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  nome?: string;

  @ApiProperty({
    description: 'Nome de usuário único para login (entre 4 e 15 caracteres)',
    example: 'joao123',
    required: false,
    minLength: 4,
    maxLength: 15
  })

  @ApiProperty({
    description: 'Endereço de email único do usuário',
    example: 'joao@email.com',
    required: false,
    format: 'email'
  })
  @IsOptional()
  @IsEmail(undefined, { message: 'O e-mail informado é inválido' })
  @EmailEhUnico({ message: 'Já existe um usuário com este e-mail' })
  email?: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
    required: false,
    minLength: 6,
    writeOnly: true
  })
  @IsOptional()
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres' })
  senha?: string;

  @ApiProperty({
    description: 'Número de telefone do usuário (entre 8 e 20 caracteres)',
    example: '11999999999',
    required: false,
    minLength: 8,
    maxLength: 20
  })
  @IsOptional()
  @IsNotEmpty({ message: 'O telefone não pode ser vazio' })
  @IsString()
  @Length(8, 20, { message: 'O telefone deve ter entre 8 e 20 caracteres' })
  @TelefoneEhUnico({ message: 'Já existe um usuário com este telefone' })
  telefone?: string;

  @ApiProperty({
    description: 'Data de nascimento no formato YYYY-MM-DD',
    example: '1990-01-01',
    required: false,
    format: 'date'
  })
  @IsOptional()
  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida (YYYY-MM-DD)' })
  dataDeNascimento?: string;

}