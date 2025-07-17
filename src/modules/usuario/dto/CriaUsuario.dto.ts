import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { EmailEhUnico } from '../validacao/email-eh-unico.validator';
import { TelefoneEhUnico } from '../validacao/telefone-eh-unico.validator';
import { Transform } from 'class-transformer';

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
    required: false,
    minLength: 10,
    maxLength: 11
  })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  @Length(10, 11, { message: 'O telefone deve ter entre 10 e 11 caracteres' })
  @TelefoneEhUnico({ message: 'Já existe um usuário com este telefone' })
  telefone: string;

  @ApiProperty({
    description: 'Data de nascimento no formato YYYY-MM-DD',
    example: '1990-01-01',
    required: false,
    format: 'date'
  })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida (YYYY-MM-DD)' })
  dataDeNascimento: string;

    @ApiProperty({
    description: 'Aceite dos Termos e Condições',
    example: true,
    required: true,
    type: Boolean,
    default: true
  })
  @IsNotEmpty({ message: 'É obrigatório aceitar os Termos e Condições' })
  aceiteTermosCondicoes: boolean;

  @ApiProperty({
    description: 'Aceite da Política de Privacidade',
    example: true,
    required: true,
    type: Boolean,
    default: true
  })
  @IsNotEmpty({ message: 'É obrigatório aceitar a Política de Privacidade' })
  aceitePoliticaDePrivacidade: boolean;
}