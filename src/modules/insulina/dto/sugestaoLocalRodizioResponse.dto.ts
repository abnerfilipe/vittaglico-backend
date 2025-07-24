import { ApiProperty } from '@nestjs/swagger';
import type { LadoAplicacaoInsulina } from "../enum/ladoAplicacaoInsulina.enum";
import type { LocalAplicacaoInsulina } from "../enum/localAplicacaoInsulina.enum";
import type { QuadranteAplicacaoInsulina } from "../enum/quadranteAplicacaoInsulina.enum";

export class SugestaoLocalRodizioResponseDto {
  @ApiProperty({ description: 'Local sugerido para aplicação de insulina', example: 'abdome', enum: ['abdome', 'braco', 'coxa', 'nadega'] })
  local: LocalAplicacaoInsulina;

  @ApiProperty({ description: 'Lado sugerido para aplicação', example: 'direito', enum: ['direito', 'esquerdo'] })
  lado: LadoAplicacaoInsulina;

  @ApiProperty({ description: 'Quadrante sugerido para aplicação', example: 'superior-direito', enum: ['superior-direito', 'superior-esquerdo', 'inferior-direito', 'inferior-esquerdo', 'central'], nullable: true, required: false })
  quadrante: QuadranteAplicacaoInsulina | null;

  @ApiProperty({ description: 'Data do último uso deste local/lado/quadrante', example: '2025-07-22T19:30:00Z', required: false, nullable: true, type: String })
  ultimoUso?: Date;
}