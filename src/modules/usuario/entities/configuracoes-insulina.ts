// Objeto de Valor (VO) ConfiguracoesInsulina como JSONB para simplicidade no MVP
export class ConfiguracoesInsulina {
  glicoseAlvo: number; // Ex: 100 mg/dL
  fatorSensibilidadeInsulina: number; // Ex: 50 (1 unidade baixa 50mg/dL)

  constructor(
    glicoseAlvo: number, 
    fatorSensibilidadeInsulina: number
  ) {
    this.glicoseAlvo = glicoseAlvo;
    this.fatorSensibilidadeInsulina = fatorSensibilidadeInsulina;
  }
}