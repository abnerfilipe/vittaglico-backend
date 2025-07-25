import { ApiProperty } from '@nestjs/swagger';
import { TipoInsulinaEnum } from '../enum/tipoInsulina.enum';
import { Transform } from 'class-transformer';
import { Insulina } from '../entities/insulina.entity';
import type { QuadranteAplicacaoInsulina } from '../enum/quadranteAplicacaoInsulina.enum';

export class ListAplicacaoInsulinaDto {
  @ApiProperty({ description: 'ID da aplicação de insulina', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Quantidade de unidades aplicadas', example: 12 })
  quantidadeUnidades: number;

  @ApiProperty({ description: 'Data e hora da aplicação', example: 'DD/MM/YYYY HH:mm:ss' })
  dataHoraAplicacao: string;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  usuarioId: string;

  @ApiProperty({ description: 'ID da insulina associada', example: 'uuid', required: false, nullable: true })
  insulinaId?: string;

  @ApiProperty({ description: 'Nome da insulina', example: 'Humalog', required: false, nullable: true })
  nome?: string;

  @ApiProperty({ description: 'Tipo da insulina (Basal ou Correção)', example: 'Correção', enum: TipoInsulinaEnum, required: false, nullable: true })
  tipoBasalCorrecao?: TipoInsulinaEnum;

  @ApiProperty({ description: 'Duração da ação em horas', example: 3, required: false, nullable: true })
  duracaoAcaoHoras?: number;

  @ApiProperty({ description: 'Pico de ação em horas (opcional)', example: 1.5, required: false, nullable: true })
  picoAcaoHoras?: number;

  @ApiProperty({ description: 'Data de criação', example: 'DD/MM/YYYY HH:mm:ss' })

  createdAt: string;
  
  @ApiProperty({ description: 'Data de atualização', example: 'DD/MM/YYYY HH:mm:ss' })
  updatedAt: string;

  @ApiProperty({ description: 'Insulina associada', type: Insulina, required: false })
  insulinaAssociada: Insulina;

  @ApiProperty({ description: 'Local de aplicação', example: 'Abdome', required: true })
  localAplicacao: string;

  @ApiProperty({ description: 'Lado de aplicação', example: 'Direito', required: true })
  ladoAplicacao: string;

 @ApiProperty({ 
    description: 'Quadrante de aplicação da insulina', 
    example: 'Superior Direito',
    nullable: true 
  })
  quadranteAplicacao?: QuadranteAplicacaoInsulina | null; 


  @ApiProperty({ description: 'Descrição completa', example: 'Aplicação de insulina no abdome direito, quadrante superior', required: true })
  descricaoCompleta: string;
}