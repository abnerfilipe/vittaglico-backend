import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TipoInsulinaEnum } from '../enum/tipoInsulina.enum';

export class UpdateInsulinaDto {
  @ApiProperty({ description: 'ID da insulina', example: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Nome da insulina', example: 'Humalog', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'Tipo da insulina (Basal ou Bolus)', example: 'BOLUS', enum: TipoInsulinaEnum, required: false })
  @IsOptional()
  @IsEnum(TipoInsulinaEnum)
  tipoBasalBolus?: TipoInsulinaEnum;

  @ApiProperty({ description: 'Duração da ação em horas', example: 3, required: false })
  @IsOptional()
  @IsNumber()
  duracaoAcaoHoras?: number;

  @ApiProperty({ description: 'Pico de ação em horas (opcional)', example: 1.5, required: false })
  @IsOptional()
  @IsNumber()
  picoAcaoHoras?: number;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  usuarioId?: string;
}