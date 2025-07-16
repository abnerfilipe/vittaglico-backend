import { ApiProperty } from '@nestjs/swagger';

export class ListaTokenDTO {
  @ApiProperty({
    description: 'ID único do token',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  id: string;

  @ApiProperty({
    description: 'Token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'Indica se o token foi revogado',
    example: false,
  })
  isRevoked: boolean;

  @ApiProperty({
    description: 'Data de expiração do token',
    example: '2025-08-01T00:00:00Z',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'ID do usuário associado ao token',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  usuarioId: string;

  @ApiProperty({
    description: 'Data de criação do token',
    example: '2025-07-15T10:30:00Z',
  })
  createdAt: Date;

  constructor(
    id: string,
    token: string,
    isRevoked: boolean,
    expiresAt: Date,
    usuarioId: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.token = token;
    this.isRevoked = isRevoked;
    this.expiresAt = expiresAt;
    this.usuarioId = usuarioId;
    this.createdAt = createdAt;
  }
}