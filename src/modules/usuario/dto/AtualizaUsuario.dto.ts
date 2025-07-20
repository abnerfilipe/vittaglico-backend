import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ConfiguracoesInsulinaDTO } from './ConfiguracoesInsulina.dto';
import { Transform } from 'class-transformer';

export class AtualizaUsuarioDTO {
  @ApiProperty({ description: 'Nome do usuário', example: 'João da Silva', required: false })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@example.com', required: false })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  email?: string;

  @ApiProperty({ description: 'Telefone do usuário', example: '5511999999999', required: false })
  @IsString()
  @Length(8, 20, { message: 'O telefone deve ter entre 8 e 20 caracteres' })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  telefone?: string;

  @ApiProperty({ description: 'Data de nascimento do usuário', example: '10/02/1990', required: false })
  @IsString()
  @Matches(/^(\d{2})\/(\d{2})\/(\d{4})$/, { message: 'A data de nascimento deve ser uma data válida (DD/MM/AAAA)' })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || typeof value !== 'string') return undefined;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/;
    const match = value.match(regex);
    if (match) {
      const [_, dia, mes, ano, hora = '00', min = '00', seg = '00'] = match;
      return `${ano}-${mes}-${dia}T${hora}:${min}:${seg}`;
    }
    return value;
  })
  dataDeNascimento?: string;

  @ApiProperty({ description: 'Configurações de insulina do usuário', required: false })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  configuracoesInsulina?: ConfiguracoesInsulinaDTO;
}