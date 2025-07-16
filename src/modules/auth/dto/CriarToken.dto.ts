import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CriaTokenDTO {
  @ApiProperty({
    description: 'Token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty({ message: 'O token é obrigatório' })
  token: string;

  @ApiProperty({
    description: 'Indica se o token foi revogado',
    example: false,
    default: false,
  })
  @IsBoolean()
  isRevoked?: boolean;

  @ApiProperty({
    description: 'Data de expiração do token',
    example: '2025-08-01T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'A data de expiração é obrigatória' })
  expiresAt: Date;

  @ApiProperty({
    description: 'ID do usuário associado ao token',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  usuarioId: string;
}