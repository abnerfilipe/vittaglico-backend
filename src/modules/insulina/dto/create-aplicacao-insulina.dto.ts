import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateAplicacaoInsulinaDto {
  @ApiProperty({ description: 'Quantidade de unidades aplicadas', example: 12 })
  @IsNotEmpty({ message: 'A quantidade de unidades não pode ser vazia' })
  @IsNumber()
  quantidadeUnidades: number;

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
  @IsString({ message: 'A data e hora da aplicação deve ser uma string no formato DD/MM/YYYY HH:mm:ss' })
  @IsNotEmpty({ message: 'A data e hora da aplicação não pode ser vazia' })
  dataHoraAplicacao: string;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ description: 'ID da insulina associada', example: 'uuid', required: true })
  @IsUUID()
  insulinaId: string;
}