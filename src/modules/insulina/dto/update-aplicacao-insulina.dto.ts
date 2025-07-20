import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsUUID, IsOptional } from 'class-validator';

export class UpdateAplicacaoInsulinaDto {
  @ApiProperty({ description: 'ID da aplicação de insulina', example: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Quantidade de unidades aplicadas', example: 12, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' ? undefined : value)
  quantidadeUnidades?: number;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => value === '' ? undefined : value)
  usuarioId?: string;

  @ApiProperty({ description: 'ID da insulina associada', example: 'uuid', required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => value === '' ? undefined : value)
  insulinaId?: string;
}