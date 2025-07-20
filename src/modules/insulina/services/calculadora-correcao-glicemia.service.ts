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

  /**
   * Calcula o bolus de correção necessário para um usuário com base em sua glicemia atual
   * @param usuarioId ID do usuário
   * @param valorGlicemiaAtual Valor da glicemia atual (opcional)
   * @param glicemiaId ID de uma medição de glicemia específica (opcional)
   * @returns Quantidade de insulina a ser aplicada (bolus de correção)
   */
  async calcularBolusCorrecao(
    usuarioId: string,
    valorGlicemiaAtual?: number,
    glicemiaId?: string,
  ): Promise<number> {
    // Verificar se o usuário existe e buscar suas configurações
    const usuario = await this.usuarioService.buscaPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const configs = usuario.configuracoesInsulina;
    if (!configs || configs.glicoseAlvo === undefined || configs.fatorSensibilidadeInsulina === undefined) {
      throw new Error('Configurações de insulina incompletas para o cálculo do bolus.');
    }

    // Obter a glicemia para o cálculo
    let glicemia: Glicemia;

    if (glicemiaId) {
      // Prioridade 1: Usar a glicemia especificada pelo ID
      const glicemiaEspecifica = await this.glicemiaService.buscarPor(usuarioId, { id: glicemiaId });
      if (!glicemiaEspecifica) {
        throw new NotFoundException('Glicemia especificada não foi encontrada.');
      }
      glicemia = glicemiaEspecifica;
    } else if (valorGlicemiaAtual !== undefined && valorGlicemiaAtual !== null) {
      // Prioridade 2: Usar o valor de glicemia fornecido
      glicemia = new Glicemia();
      glicemia.valor = valorGlicemiaAtual;
      glicemia.usuarioId = usuarioId;
      // Removido a atribuição para dataHoraMedicao pois não existe na entidade Glicemia
    } else {
      // Prioridade 3: Buscar a última glicemia registrada
      const ultimaGlicemia = await this.glicemiaService.buscarUltimaGlicemia(usuarioId);
      if (!ultimaGlicemia) {
        throw new Error('Nenhuma glicemia registrada para calcular o bolus.');
      }
      glicemia = ultimaGlicemia;
    }

    // Executar o cálculo do bolus
    const glicoseAtual = glicemia.valor;
    const glicoseAlvo = configs.glicoseAlvo;
    const fsi = configs.fatorSensibilidadeInsulina;

    // Apenas aplica correção se a glicose atual for maior que a glicose alvo
    if (glicoseAtual <= glicoseAlvo) {
      return 0; // Nenhuma correção necessária
    }

    const correcaoBruta = (glicoseAtual - glicoseAlvo) / fsi;

    // Buscar aplicações recentes para calcular a insulina ativa
    const dataHoraAtual = new Date();
    const aplicacoesRecentes = await this.aplicacaoInsulinaService.findAtivasByUsuarioId(usuarioId, dataHoraAtual);

    const insulinaAtiva = this.calcularInsulinaAtiva(aplicacoesRecentes, dataHoraAtual);

    // Ajustar o bolus considerando insulina ativa
    const bolusFinal = correcaoBruta - insulinaAtiva;

    // Garante que o bolus não seja negativo
    return Math.max(0, bolusFinal);
  }
}