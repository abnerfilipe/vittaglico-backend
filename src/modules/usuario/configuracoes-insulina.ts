// Objeto de Valor (VO) ConfiguracoesInsulina como JSONB para simplicidade no MVP
// Em um sistema maior, poderia ser uma entidade separada ou uma tabela com colunas dedicadas.
export class ConfiguracoesInsulina {
  glicoseAlvo: number; // Ex: 100
  fatorSensibilidadeInsulina: number; // Ex: 50 (1 unidade baixa 50mg/dL)
  duracaoAcaoInsulina: number; // Ex: 4 (horas que a insulina age)

  constructor(glicoseAlvo: number, fsi: number, dai: number) {
    this.glicoseAlvo = glicoseAlvo;
    this.fatorSensibilidadeInsulina = fsi;
    this.duracaoAcaoInsulina = dai;
  }
}