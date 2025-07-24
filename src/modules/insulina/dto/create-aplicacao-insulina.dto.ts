
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { LadoAplicacaoInsulina } from '../enum/ladoAplicacaoInsulina.enum';
import { LocalAplicacaoInsulina } from '../enum/localAplicacaoInsulina.enum';
import { QuadranteAplicacaoInsulina } from '../enum/quadranteAplicacaoInsulina.enum';

export class CreateAplicacaoInsulinaDto {
  @ApiProperty({ description: 'Quantidade de unidades aplicadas', example: 12 })
  @IsNotEmpty({ message: 'A quantidade de unidades não pode ser vazia' })
  @IsNumber()
  quantidadeUnidades: number;

  @ApiProperty({ description: 'Data e hora da aplicação', example: '22/07/2025 19:30:00' })
  @IsString({ message: 'A data e hora da aplicação deve ser uma string no formato DD/MM/YYYY HH:mm:ss' })
  @IsNotEmpty({ message: 'A data e hora da aplicação não pode ser vazia' })
  dataHoraAplicacao: string;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ description: 'ID da insulina associada', example: 'uuid', required: true })
  @IsUUID()
  insulinaId: string;


  @IsIn(Object.values(LocalAplicacaoInsulina)) 
  localAplicacao: LocalAplicacaoInsulina;

  @IsIn(Object.values(LadoAplicacaoInsulina))
  ladoAplicacao: LadoAplicacaoInsulina;

  @IsIn(Object.values(QuadranteAplicacaoInsulina))
  @IsOptional()
  quadranteAplicacao?: QuadranteAplicacaoInsulina;
}