import { LadoAplicacaoInsulina } from "../enum/ladoAplicacaoInsulina.enum";
import { LocalAplicacaoInsulina } from "../enum/localAplicacaoInsulina.enum";
import { QuadranteAplicacaoInsulina } from "../enum/quadranteAplicacaoInsulina.enum";

export const LOCAL_QUADRANTE_MAP:  {
  [key in LocalAplicacaoInsulina]: {
    [key2 in LadoAplicacaoInsulina]: QuadranteAplicacaoInsulina[]; 
  };
} = {
  [LocalAplicacaoInsulina.ABDOME]: {
    [LadoAplicacaoInsulina.DIREITO]: [
      QuadranteAplicacaoInsulina.SUPERIOR_DIREITO,
      QuadranteAplicacaoInsulina.INFERIOR_DIREITO,
      QuadranteAplicacaoInsulina.CENTRAL, 
    ],
    [LadoAplicacaoInsulina.ESQUERDO]: [
      QuadranteAplicacaoInsulina.SUPERIOR_ESQUERDO,
      QuadranteAplicacaoInsulina.INFERIOR_ESQUERDO,
      QuadranteAplicacaoInsulina.CENTRAL, 
    ],
  },
[LocalAplicacaoInsulina.BRACO]: {
  [LadoAplicacaoInsulina.DIREITO]: [QuadranteAplicacaoInsulina.AREA_TOTAL],
  [LadoAplicacaoInsulina.ESQUERDO]: [QuadranteAplicacaoInsulina.AREA_TOTAL],
},
[LocalAplicacaoInsulina.COXA]: {
  [LadoAplicacaoInsulina.DIREITO]: [QuadranteAplicacaoInsulina.AREA_TOTAL],
  [LadoAplicacaoInsulina.ESQUERDO]: [QuadranteAplicacaoInsulina.AREA_TOTAL],
},

  [LocalAplicacaoInsulina.NADEGA]: {
    [LadoAplicacaoInsulina.DIREITO]: [
      QuadranteAplicacaoInsulina.SUPERIOR_DIREITO,
    ],
    [LadoAplicacaoInsulina.ESQUERDO]: [
      QuadranteAplicacaoInsulina.SUPERIOR_ESQUERDO,
    ],
  },
};
