import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CalcularBolusDto {
  @ApiProperty({ 
    description: 'ID do usuário', 
    example: 'uuid',
    required: true 
  })
  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @ApiPropertyOptional({
    description: 'Glicose atual do paciente em mg/dL (opcional se glicemiaId for fornecido)',
    example: 150,
  })
  @IsNumber({}, { message: 'Glicose atual deve ser um número válido' })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  glicoseAtual?: number;

  @ApiPropertyOptional({
    description: 'ID de uma medição de glicemia específica (opcional)',
    example: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  glicemiaId?: string;
}