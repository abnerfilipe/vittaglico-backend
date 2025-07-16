import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class AtualizaTokenDTO {
  @ApiProperty({
    description: 'Indica se o token foi revogado',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isRevoked?: boolean;

  @ApiProperty({
    description: 'Data de expiração do token',
    example: '2025-08-01T00:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  expiresAt?: Date;

  @ApiProperty({
    description: 'Token JWT atualizado',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  @IsString()
  @IsOptional()
  token?: string;
}