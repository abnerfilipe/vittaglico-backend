import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ConfiguracoesInsulinaDTO } from './ConfiguracoesInsulina.dto';

export class CriaUsuarioDTO {
  @ApiProperty({ description: 'Nome do usuário', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  nome: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@example.com' })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
  @IsString()
  @Length(6, 20, { message: 'A senha precisa ter pelo menos 6 caracteres' })
  senha: string;

  @ApiProperty({ description: 'Telefone do usuário', example: '5511999999999' })
  @IsString()
  @Length(8, 20, { message: 'O telefone deve ter entre 8 e 20 caracteres' })
  telefone: string;

  @ApiProperty({ description: 'Data de nascimento do usuário', example: '10/02/1990' })
  @IsString()
  @Matches(/^(\d{2})\/(\d{2})\/(\d{4})$/, { message: 'A data de nascimento deve ser uma data válida (DD/MM/AAAA)' })
  dataDeNascimento: string;

  @ApiProperty({ description: 'Configurações de insulina do usuário' })
  configuracoesInsulina: ConfiguracoesInsulinaDTO;
}