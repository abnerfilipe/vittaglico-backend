
export class ConfiguracoesInsulina {
  glicoseAlvo: number; 
  fatorSensibilidadeInsulina: number; 

  constructor(
    glicoseAlvo: number, 
    fatorSensibilidadeInsulina: number
  ) {
    this.glicoseAlvo = glicoseAlvo;
    this.fatorSensibilidadeInsulina = fatorSensibilidadeInsulina;
  }
}