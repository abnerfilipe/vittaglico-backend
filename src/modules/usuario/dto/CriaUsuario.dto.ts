import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ConfiguracoesInsulinaDTO } from './ConfiguracoesInsulina.dto';
import { Transform } from 'class-transformer';

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

  @ApiProperty({ description: 'Telefone do usuário', example: '11999999999' })
  @IsString()
  @Length(12, 12, { message: 'O telefone deve ter ate 12 caracteres' })
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsOptional()
  telefone: string;


  @ApiProperty({ description: 'Aceite dos termos e condições', example: true })
  @Transform(({ value }) => value === "true" ? true : value)
  @Transform(({ value }) => value === "false" ? false : value)
  @IsBoolean()
  aceiteTermosCondicoes: boolean;

  @ApiProperty({ description: 'Aceite da política de privacidade', example: true })
  @Transform(({ value }) => value === "true" ? true : value)
  @Transform(({ value }) => value === "false" ? false : value)
  @IsBoolean()
  aceitePoliticaDePrivacidade: boolean;

  @ApiProperty({ description: 'Data de nascimento do usuário', example: '10/02/1990' })
  @IsString()
  @Matches(/^(\d{2})\/(\d{2})\/(\d{4})$/, { message: 'A data de nascimento deve ser uma data válida (DD/MM/AAAA)' })
  @Transform(({ value }) => value === '' ? undefined : value)
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
  @IsOptional()
  dataDeNascimento: string;

  @ApiProperty({ description: 'Configurações de insulina do usuário', example: {} })
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsOptional()
  configuracoesInsulina: ConfiguracoesInsulinaDTO;

}