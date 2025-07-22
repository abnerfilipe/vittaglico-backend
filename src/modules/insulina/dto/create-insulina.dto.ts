import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { TipoInsulinaEnum } from '../enum/tipoInsulina.enum';
import { Transform } from 'class-transformer';

export class CreateInsulinaDto {
  @ApiProperty({ description: 'Nome da insulina', example: 'Humalog' })
  @IsNotEmpty({ message: 'O nome da insulina não pode ser vazio' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Tipo da insulina (Basal ou Correção)', example: 'Correção', enum: TipoInsulinaEnum })
  @IsString()
  @IsEnum(TipoInsulinaEnum)
  tipoBasalCorrecao: TipoInsulinaEnum;

  @ApiProperty({ description: 'Duração da ação em horas', example: 3 })
  @IsNumber()
  duracaoAcaoHoras: number;

  @ApiProperty({ description: 'Pico de ação em horas (opcional)', example: 1.5, required: false })
  @IsNumber()
  @Transform(({ value }) => value === '' ? undefined : value)
  picoAcaoHoras?: number;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  @IsUUID()
  usuarioId: string;
}