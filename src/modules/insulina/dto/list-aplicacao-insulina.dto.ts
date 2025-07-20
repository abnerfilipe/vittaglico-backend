import { ApiProperty } from '@nestjs/swagger';

export class ListAplicacaoInsulinaDto {
  @ApiProperty({ description: 'ID da aplicação de insulina', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Quantidade de unidades aplicadas', example: 12 })
  quantidadeUnidades: number;

  @ApiProperty({ description: 'Data e hora da aplicação', example: '2025-07-19T14:30:00Z' })
  dataHoraAplicacao: Date;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  usuarioId: string;

  @ApiProperty({ description: 'ID da insulina associada', example: 'uuid', required: false, nullable: true })
  insulinaId?: string;
}