import { ApiProperty } from '@nestjs/swagger';
import { TipoInsulinaEnum } from '../enum/tipoInsulina.enum';

export class ListInsulinaDto {
  @ApiProperty({ description: 'ID da insulina', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Nome da insulina', example: 'Humalog' })
  nome: string;

  @ApiProperty({ description: 'Tipo da insulina (Basal ou Bolus)', example: 'BOLUS', enum: TipoInsulinaEnum })
  tipoBasalBolus: TipoInsulinaEnum;

  @ApiProperty({ description: 'Duração da ação em horas', example: 3 })
  duracaoAcaoHoras: number;

  @ApiProperty({ description: 'Pico de ação em horas (opcional)', example: 1.5, required: false, nullable: true })
  picoAcaoHoras?: number;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  usuarioId: string;
}