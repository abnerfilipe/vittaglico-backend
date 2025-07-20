import { ApiProperty } from '@nestjs/swagger';
import { ConfiguracoesInsulinaDTO } from './ConfiguracoesInsulina.dto';
import { Transform } from 'class-transformer';

export class ListaUsuarioDTO {
  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário', example: 'João da Silva' })
  nome: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@example.com' })
  email: string;

  @ApiProperty({ description: 'Data de nascimento do usuário', example: '10/02/1990' })
  dataDeNascimento: string;

  @ApiProperty({ description: 'Telefone do usuário', example: '5511999999999' })
  telefone: string;

  @ApiProperty({ description: 'Data de criação do usuário' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização do usuário' })
  updatedAt: string;

  @ApiProperty({ description: 'Configurações de insulina do usuário', required: false })
  @Transform(({ value }) => value === '' ? undefined : value)
  configuracoesInsulina?: ConfiguracoesInsulinaDTO;
}