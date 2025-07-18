import { ApiProperty } from '@nestjs/swagger';
import { PeriodoEnum } from '../enum/periodo.enum';

export class ListGlicemiaDto {
  @ApiProperty({ description: 'ID da glicemia', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  usuarioId: string;

  @ApiProperty({ description: 'Valor da glicemia', example: 120 })
  valor: number;

  @ApiProperty({ description: 'Medida da glicemia', example: 'mg/dL' })
  medida: string;

  @ApiProperty({ description: 'Período da glicemia', enum: PeriodoEnum, example: 'JEJUM' })
  periodo: PeriodoEnum;

  @ApiProperty({ description: 'Data e hora do registro', example: '17/07/2025 10:30' })
  dataHoraDeRegistro: string;

  @ApiProperty({ description: 'Data de criação', example: '17/07/2025 10:30' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '17/07/2025 10:30' })
  updatedAt: string;
}