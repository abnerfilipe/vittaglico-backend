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
  @IsOptional()
  @Transform(({ value }) => value === 0 ? undefined : value)
  @IsNumber({}, { message: 'Glicose atual deve ser um número válido' })
  glicoseAtual?: number;

  @ApiPropertyOptional({
    description: 'ID de uma medição de glicemia específica (opcional)',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => value === '' || value === null || value == "null" ? undefined : value)
  glicemiaId?: string;
}