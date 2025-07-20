import { Injectable, NotFoundException } from "@nestjs/common";
import { Glicemia } from "../../glicemia/entities/glicemia.entity";
import { PeriodoEnum } from "../../glicemia/enum/periodo.enum";
import { GlicemiaService } from "../../glicemia/glicemia.service";
import { UsuarioService } from "../../usuario/usuario.service";
import { AplicacaoInsulina } from "../entities/aplicacao-insulina.entity";
import { AplicacaoInsulinaService } from "./aplicacao-insulina.service";

@Injectable()
export class CalculadoraCorrecaoGlicemiaService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly aplicacaoInsulinaService: AplicacaoInsulinaService,
    private readonly glicemiaService: GlicemiaService,
  ) {}

  private calcularInsulinaAtiva(
    aplicacoesAnteriores: AplicacaoInsulina[],
    dataHoraAtual: Date,
  ): number {
    let insulinaAtiva = 0;
    for (const aplicacao of aplicacoesAnteriores) {
      const tempoDecorridoEmMilissegundos = dataHoraAtual.getTime() - new Date(aplicacao.dataHoraAplicacao).getTime();
      const tempoDecorridoEmHoras = tempoDecorridoEmMilissegundos / (1000 * 60 * 60);
      const daiEfetiva = aplicacao.duracaoAcaoInsulinaEfetiva;

      if (tempoDecorridoEmHoras < daiEfetiva) {
        // Cálculo linear simplificado da insulina ativa restante
        const proporcaoRestante = 1 - (tempoDecorridoEmHoras / daiEfetiva);
        insulinaAtiva += aplicacao.quantidadeUnidades * proporcaoRestante;
      }
    }
    return insulinaAtiva;
  }

  async calcularBolusCorrecao(
    usuarioId: string,
    valorGlicemiaAtual?: number, // Pode ser passado ou buscar a última registrada
    dataHoraGlicemia: Date = new Date(),
    periodo: PeriodoEnum = PeriodoEnum.EXTRA,
  ): Promise<number> {
    const usuario = await this.usuarioService.buscaPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const configs = usuario.configuracoesInsulina;
    if (!configs || configs.glicoseAlvo === undefined || configs.fatorSensibilidadeInsulina === undefined || configs.duracaoAcaoInsulina === undefined) {
      throw new Error('Configurações de insulina incompletas para o cálculo do bolus.');
    }

    let glicemia: Glicemia;
    if (valorGlicemiaAtual !== undefined && valorGlicemiaAtual !== null) {
      glicemia = new Glicemia(valorGlicemiaAtual, usuarioId, dataHoraGlicemia, periodo);
    } else {
      const ultimaGlicemia = await this.glicemiaService.buscarUltimaGlicemia(usuarioId);
      if (!ultimaGlicemia) {
        throw new Error('Nenhuma glicemia registrada para calcular o bolus.');
      }
      glicemia = ultimaGlicemia;
    }

    const glicoseAtual = glicemia.valor;
    const glicoseAlvo = configs.glicoseAlvo;
    const fsi = configs.fatorSensibilidadeInsulina;

    // Apenas aplica correção se a glicose atual for maior que a glicose alvo
    if (glicoseAtual <= glicoseAlvo) {
      return 0; // Nenhuma correção necessária
    }

    const correcaoBruta = (glicoseAtual - glicoseAlvo) / fsi;

    // Buscar aplicações recentes (dentro do DAI máximo esperado, por exemplo, 6 horas)
    const dataHoraAtual = new Date();
    const aplicacoesRecentes = await this.aplicacaoInsulinaService.findAtivasByUsuarioId(usuarioId, dataHoraAtual);

    const insulinaAtiva = this.calcularInsulinaAtiva(aplicacoesRecentes, dataHoraAtual);

    const bolusFinal = correcaoBruta - insulinaAtiva;

    return Math.max(0, bolusFinal); // Garante que o bolus não seja negativo
  }
   
}