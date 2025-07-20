import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateAplicacaoInsulinaDto {
  @ApiProperty({ description: 'Quantidade de unidades aplicadas', example: 12 })
  @IsNotEmpty({ message: 'A quantidade de unidades não pode ser vazia' })
  @IsNumber()
  quantidadeUnidades: number;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ description: 'ID da insulina associada', example: 'uuid', required: false, nullable: true })
  @IsUUID()
  insulinaId?: string;
}