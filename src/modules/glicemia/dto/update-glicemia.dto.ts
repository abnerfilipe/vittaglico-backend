import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { PeriodoEnum } from '../enum/periodo.enum';

export class UpdateGlicemiaDto {
  @ApiProperty({
    description: 'ID relacionado à glicemia',
    example: 'uuid-do-registro',
    required: true,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Valor da glicemia',
    example: 120,
    type: 'integer',
    required: false,
  })
  @IsInt()
  @IsOptional()
  valor?: number;

  @ApiProperty({
    description: 'Período da medição',
    enum: PeriodoEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(PeriodoEnum)
  periodo?: PeriodoEnum;

  @ApiProperty({
    description: 'Data e hora do registro',
    example: '2025-07-17T10:30:00Z',
    required: false,
  })
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
  @IsOptional()
  dataHoraDeRegistro?: string;
}