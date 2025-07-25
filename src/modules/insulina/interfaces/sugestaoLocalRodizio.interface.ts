import type { LadoAplicacaoInsulina } from "../enum/ladoAplicacaoInsulina.enum";
import type { LocalAplicacaoInsulina } from "../enum/localAplicacaoInsulina.enum";
import type { QuadranteAplicacaoInsulina } from "../enum/quadranteAplicacaoInsulina.enum";

export interface SugestaoLocalRodizio {
  local: LocalAplicacaoInsulina;
  lado: LadoAplicacaoInsulina;
  quadrante: QuadranteAplicacaoInsulina | null;
  ultimoUso?: Date; 
}