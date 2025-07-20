import { ApiProperty } from '@nestjs/swagger';

export class ConfiguracoesInsulinaDTO {
  @ApiProperty({ description: 'Glicose alvo', example: 100 })
  glicoseAlvo: number;

  @ApiProperty({ description: 'Fator de sensibilidade à insulina', example: 50 })
  fatorSensibilidadeInsulina: number;

  @ApiProperty({ description: 'Duração da ação da insulina (horas)', example: 3 })
  duracaoAcaoInsulina: number;
}