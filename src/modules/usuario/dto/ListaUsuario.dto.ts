import { ApiProperty } from '@nestjs/swagger';

export class ListaUsuarioDTO {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'uuid'
  })
  readonly id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João'
  })
  readonly nome: string;

  @ApiProperty({
    description: 'Endereço de email do usuário',
    example: 'joao@email.com'
  })
  readonly email: string;

  @ApiProperty({
    description: 'Nome de usuário para login',
    example: 'joao123'
  })
  readonly username: string;

  @ApiProperty({
    description: 'Data de nascimento do usuário no formato YYYY-MM-DD',
    example: '1990-01-01'
  })
  readonly dataDeNascimento: string;

  @ApiProperty({
    description: 'Número de telefone do usuário',
    example: '11999999999'
  })
  readonly telefone: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-07-15T10:30:00Z'
  })
  readonly createdAt?: string;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2025-07-15T10:30:00Z'
  })
  readonly updatedAt?: string;

  @ApiProperty({
    description: 'Data de exclusão (soft delete)',
    example: null,
    nullable: true
  })
  readonly deletedAt?: string | null;

  constructor(
    id: string,
    nome: string,
    email: string,
    username: string,
    dataDeNascimento: string,
    telefone: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string | null,
  ) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.username = username;
    this.dataDeNascimento = dataDeNascimento;
    this.telefone = telefone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}