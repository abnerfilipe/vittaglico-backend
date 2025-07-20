import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CalcularBolusDto {
  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  @IsUUID()
  usuarioId: string;

  @ApiPropertyOptional({
    description: 'Glicose atual do paciente. Opcional, para buscar a última glicemia registrada.',
    type: Number,
  })
  @IsNumber({},{message: 'Glicose atual deve ser um número.'})
  @IsOptional()
  glicoseAtual?: number; // Opcional, para buscar a última glicemia registrada
}