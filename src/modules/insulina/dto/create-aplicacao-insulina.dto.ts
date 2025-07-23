// filepath: /Users/filipeabner/code/vittaglico-backend/src/modules/insulina/dto/create-aplicacao-insulina.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

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
}