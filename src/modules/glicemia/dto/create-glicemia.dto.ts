import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { PeriodoEnum } from '../enum/periodo.enum';

export class CreateGlicemiaDto {
  @ApiProperty({
    description: 'ID do usuário relacionado à glicemia',
    example: 'uuid-do-usuario',
  })
  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @ApiProperty({
    description: 'Valor da glicemia',
    example: 120,
    type: 'integer',
  })
  @IsInt()
  @IsNotEmpty()
  valor: number;

  @ApiProperty({
    description: 'Unidade de medida (padrão: mg/dL)',
    example: 'mg/dL',
    required: false,
    default: 'mg/dL',
  })
  @Transform(({ value }) => value === '' ? undefined : "mg/dL")
  @IsOptional()
  medida?: string = 'mg/dL';

  @ApiProperty({
    description: 'Período da medição',
    enum: PeriodoEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(PeriodoEnum)
  @Transform(({ value }) => value === '' ? undefined : value)
  periodo?: PeriodoEnum;

  @ApiProperty({
    description: 'Data e hora do registro',
    example: '2025-07-17T10:30:00Z',
    required: true,
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
  @IsNotEmpty()
  dataHoraDeRegistro: string;
}