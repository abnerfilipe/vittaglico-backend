import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, isString } from 'class-validator';
import { LadoAplicacaoInsulina } from '../enum/ladoAplicacaoInsulina.enum';
import { LocalAplicacaoInsulina } from '../enum/localAplicacaoInsulina.enum';
import { QuadranteAplicacaoInsulina } from '../enum/quadranteAplicacaoInsulina.enum';
import { Transform } from 'class-transformer';

export class CreateAplicacaoInsulinaDto {
  @ApiProperty({ description: 'ID do usuário que aplicou a insulina' })
  @IsNotEmpty({ message: 'O ID do usuário não pode ser vazio' })
  usuarioId: string;

  @ApiProperty({ description: 'Quantidade de unidades de insulina aplicada' })
  @IsNotEmpty({ message: 'A quantidade de unidades não pode ser vazia' })
  quantidadeUnidades: number;

  @ApiProperty({ description: 'ID da insulina associada à aplicação' })
  @IsNotEmpty({ message: 'O ID da insulina não pode ser vazio' })
  insulinaId: string;

  @ApiProperty({ description: 'Data e hora da aplicação da insulina' })
  @IsNotEmpty({ message: 'A data e hora da aplicação não podem ser vazias' })
  dataHoraAplicacao: string;

  @ApiProperty({ description: 'Local de aplicação da insulina', required: false, example: 'Abdome' })
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.includes(' - ')) {
      
      return value.split(' - ')[0] as LocalAplicacaoInsulina;
    }
    return value;
  })
  @IsString({ message: 'O local de aplicação deve ser uma string válida' })
  localAplicacao: LocalAplicacaoInsulina;

  @ApiProperty({ description: 'Lado de aplicação da insulina', required: false, example: 'Direito' })
  @Transform(({ value, obj }) => {
    if (typeof obj.localAplicacao === 'string' && obj.localAplicacao.includes('(')) {
      
      const match = obj.localAplicacao.match(/\(([^)]+)\)/);
      if (match && match[1]) {
        return match[1] as LadoAplicacaoInsulina;
      }
    }
    return value;
  })
  @IsString({ message: 'O lado de aplicação deve ser uma string válida' })
  ladoAplicacao: LadoAplicacaoInsulina;

  @ApiProperty({ description: 'Quadrante de aplicação da insulina', required: false, example: 'Superior Direito' })
  @Transform(({ value, obj }) => {
    if (typeof obj.localAplicacao === 'string' && obj.localAplicacao.includes(' - ')) {
      
      const parts = obj.localAplicacao.split(' - ');
      if (parts.length > 1) {
        
        const quadrantePart = parts[1].split(' (')[0];
        return quadrantePart as QuadranteAplicacaoInsulina;
      }
    }
    return value;
  })
  @IsString({ message: 'O quadrante de aplicação deve ser uma string válida' })
  quadranteAplicacao: QuadranteAplicacaoInsulina;
}