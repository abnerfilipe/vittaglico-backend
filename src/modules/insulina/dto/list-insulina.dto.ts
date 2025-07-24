import { ApiProperty } from '@nestjs/swagger';
import { TipoInsulinaEnum } from '../enum/tipoInsulina.enum';
import { Transform } from 'class-transformer';

export class ListInsulinaDto {
  @ApiProperty({ description: 'ID da insulina', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Nome da insulina', example: 'Humalog' })
  nome: string;

  @ApiProperty({ description: 'Tipo da insulina (Basal ou Correção)', example: 'Correção', enum: TipoInsulinaEnum })
  tipoBasalCorrecao: TipoInsulinaEnum;

  @ApiProperty({ description: 'Duração da ação em horas', example: 3 })
  duracaoAcaoHoras: number;

  @ApiProperty({ description: 'Pico de ação em horas (opcional)', example: 1.5, required: false, nullable: true })
  picoAcaoHoras?: number;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  usuarioId: string;

  @ApiProperty({ description: 'Data de criação', example: 'DD/MM/YYYY HH:mm:ss' })
  @Transform(({ value }) => {
    if (!value) return undefined;

    
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return value;
    }

    
    if (value instanceof Date) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${value.getFullYear()}/${pad(value.getMonth() + 1)}/${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
    }

    
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/;
    const match = typeof value === 'string' ? value.match(regex) : null;
    if (match) {
      const [_, dia, mes, ano, hora = '00', min = '00', seg = '00'] = match;
      return `${ano}-${mes}-${dia}T${hora}:${min}:${seg}`;
    }

    return value;
  })
  createdAt: string;
  
  @ApiProperty({ description: 'Data de atualização', example: 'DD/MM/YYYY HH:mm:ss' })
  @Transform(({ value }) => {
    if (!value) return undefined;

    
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return value;
    }

    
    if (value instanceof Date) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${value.getFullYear()}/${pad(value.getMonth() + 1)}/${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
    }

    
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/;
    const match = typeof value === 'string' ? value.match(regex) : null;
    if (match) {
      const [_, dia, mes, ano, hora = '00', min = '00', seg = '00'] = match;
      return `${ano}-${mes}-${dia}T${hora}:${min}:${seg}`;
    }

    return value;
  })
  updatedAt: string;
}