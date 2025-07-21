import { ApiProperty } from '@nestjs/swagger';
import { TipoInsulinaEnum } from '../enum/tipoInsulina.enum';
import { Transform } from 'class-transformer';

export class ListAplicacaoInsulinaDto {
  @ApiProperty({ description: 'ID da aplicação de insulina', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Quantidade de unidades aplicadas', example: 12 })
  quantidadeUnidades: number;

  @ApiProperty({ description: 'Data e hora da aplicação', example: 'DD/MM/YYYY HH:mm:ss' })
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
  dataHoraAplicacao: string;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  usuarioId: string;

  @ApiProperty({ description: 'ID da insulina associada', example: 'uuid', required: false, nullable: true })
  insulinaId?: string;

  @ApiProperty({ description: 'Nome da insulina', example: 'Humalog', required: false, nullable: true })
  nome?: string;

  @ApiProperty({ description: 'Tipo da insulina (Basal ou Correção)', example: 'Correção', enum: TipoInsulinaEnum, required: false, nullable: true })
  tipoBasalBolus?: TipoInsulinaEnum;

  @ApiProperty({ description: 'Duração da ação em horas', example: 3, required: false, nullable: true })
  duracaoAcaoHoras?: number;

  @ApiProperty({ description: 'Pico de ação em horas (opcional)', example: 1.5, required: false, nullable: true })
  picoAcaoHoras?: number;
}