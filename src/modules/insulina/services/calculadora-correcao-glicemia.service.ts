import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Glicemia } from "../../glicemia/entities/glicemia.entity";
import { GlicemiaService } from "../../glicemia/glicemia.service";
import { UsuarioService } from "../../usuario/usuario.service";
import { AplicacaoInsulina } from "../entities/aplicacao-insulina.entity";
import { AplicacaoInsulinaService } from "./aplicacao-insulina.service";
import { CorrecaoGlicemia } from "../entities/correcao-glicemia.entity";
import { LadoAplicacaoInsulina } from "../enum/ladoAplicacaoInsulina.enum";
import { LocalAplicacaoInsulina } from "../enum/localAplicacaoInsulina.enum";
import { QuadranteAplicacaoInsulina } from "../enum/quadranteAplicacaoInsulina.enum";

@Injectable()
export class CalculadoraCorrecaoGlicemiaService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly aplicacaoInsulinaService: AplicacaoInsulinaService,
    private readonly glicemiaService: GlicemiaService,
    @InjectRepository(CorrecaoGlicemia)
    private readonly correcaoGlicemiaRepository: Repository<CorrecaoGlicemia>,
  ) { }

  /**
   * Calcula a quantidade de insulina ativa no organismo do usuário,
   * considerando as aplicações anteriores e o tempo decorrido desde cada aplicação.
   * @param aplicacoesAnteriores Lista de aplicações de insulina anteriores.
   * @param dataHoraAtual Data e hora atual para cálculo do tempo decorrido.
   * @returns Quantidade de insulina ativa estimada.
   */
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
        const proporcaoRestante = 1 - (tempoDecorridoEmHoras / daiEfetiva);
        insulinaAtiva += aplicacao.quantidadeUnidades * proporcaoRestante;
      }
    }
    return insulinaAtiva;
  }

  /**
   * Calcula o bolus de correção necessário para um usuário com base em sua glicemia atual.
   * O cálculo considera o valor da glicemia, o alvo desejado, o fator de sensibilidade à insulina
   * e a quantidade de insulina ativa no organismo.
   * 
   * @param usuarioId ID do usuário.
   * @param valorGlicemiaAtual Valor da glicemia atual (opcional).
   * @param glicemiaId ID de uma medição de glicemia específica (opcional).
   * @returns Objeto contendo a quantidade de insulina a ser aplicada (bolus) e uma mensagem explicativa.
   * @throws NotFoundException se o usuário ou a glicemia não forem encontrados.
   * @throws Error se as configurações de insulina estiverem incompletas ou não houver glicemia registrada.
   */
  async calcularBolusCorrecao(
    usuarioId: string,
    valorGlicemiaAtual?: number,
    glicemiaId?: string,
  ): Promise<{ bolus: number; message: string }> {

    const usuario = await this.usuarioService.buscaPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const configs = usuario.configuracoesInsulina;
    if (!configs || configs.glicoseAlvo === undefined || configs.fatorSensibilidadeInsulina === undefined) {
      throw new Error('Configurações de insulina incompletas para o cálculo do bolus.');
    }

    let glicemia: Glicemia;
    let glicemiaIdParaSalvar: string | null = null;

    if (glicemiaId) {
      // Busca uma glicemia específica pelo ID
      const glicemiaEspecifica = await this.glicemiaService.buscarPor(usuarioId, { id: glicemiaId });
      if (!glicemiaEspecifica) {
        throw new NotFoundException('Glicemia especificada não foi encontrada.');
      }
      glicemia = glicemiaEspecifica;
      glicemiaIdParaSalvar = glicemiaId;
    } else if (valorGlicemiaAtual !== undefined && valorGlicemiaAtual !== null) {
      // Usa o valor informado de glicemia atual
      glicemia = new Glicemia();
      glicemia.valor = valorGlicemiaAtual;
      glicemia.usuarioId = usuarioId;
    } else {
      // Busca a última glicemia registrada do usuário
      const ultimaGlicemia = await this.glicemiaService.buscarUltimaGlicemia(usuarioId);
      if (!ultimaGlicemia) {
        throw new Error('Nenhuma glicemia registrada para calcular o bolus.');
      }
      glicemia = ultimaGlicemia;
      glicemiaIdParaSalvar = ultimaGlicemia.id;
    }

    const glicoseAtual = glicemia.valor;
    const glicoseAlvo = configs.glicoseAlvo;
    const fsi = configs.fatorSensibilidadeInsulina;

    if (glicoseAtual <= glicoseAlvo) {
      await this.correcaoGlicemiaRepository.save(this.correcaoGlicemiaRepository.create({
        usuarioId,
        glicemiaId: glicemiaIdParaSalvar,
        glicoseAtual,
        glicoseAlvo,
        fatorSensibilidadeInsulina: fsi,
        insulinaAtiva: 0,
        bolus: 0,
        message: 'Nenhuma correção necessária.',
      }));
      return { bolus: 0, message: 'Nenhuma correção necessária.' };
    }

    // Calcula a quantidade bruta de insulina para correção
    const correcaoBruta = (glicoseAtual - glicoseAlvo) / fsi;

    // Busca aplicações recentes para calcular insulina ativa
    const dataHoraAtual = new Date();
    const aplicacoesRecentes = await this.aplicacaoInsulinaService.findAtivasByUsuarioId(usuarioId, dataHoraAtual);

    const insulinaAtiva = this.calcularInsulinaAtiva(aplicacoesRecentes, dataHoraAtual);

    // Ajusta o bolus considerando insulina ativa
    let bolusFinal = correcaoBruta - insulinaAtiva;

    let message = '';

    if (bolusFinal < 0) {
      bolusFinal = 0;
      message = `Bolus de correção foi ajustado para 0 devido à insulina ativa. Correção bruta: ${correcaoBruta.toFixed(2)}, Insulina ativa: ${insulinaAtiva.toFixed(2)}.`;
    } else {
      message = `Bolus de correção calculado. Correção bruta: ${correcaoBruta.toFixed(2)}, Insulina ativa: ${insulinaAtiva.toFixed(2)}, Bolus final: ${bolusFinal.toFixed(2)}.`;
    }

    bolusFinal = Math.ceil(bolusFinal * 100) / 100;

    await this.correcaoGlicemiaRepository.save(this.correcaoGlicemiaRepository.create({
      usuarioId,
      glicemiaId: glicemiaIdParaSalvar,
      glicoseAtual,
      glicoseAlvo,
      fatorSensibilidadeInsulina: fsi,
      insulinaAtiva,
      bolus: bolusFinal,
      message,
    }));

    return { bolus: bolusFinal, message };
  }

   /**
   * Sugere o próximo local de aplicação de insulina, seguindo as regras de rodízio.
   * Prioriza locais não usados nos últimos 14 dias.
   *
   * @param usuarioId O ID do usuário para quem a sugestão será gerada.
   * @returns Um objeto contendo o local, lado e quadrante sugeridos.
   * @throws NotFoundException se o usuário não for encontrado.
   */
  async obterSugestaoRodizio(
    usuarioId: string,
  ): Promise<{
    local: LocalAplicacaoInsulina;
    lado: LadoAplicacaoInsulina;
    quadrante: QuadranteAplicacaoInsulina | null;
  }> {
    const usuario = await this.usuarioService.buscaPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado.`);
    }

    // Definir todos os locais e lados possíveis a partir dos enums
    const locaisDisponiveis = Object.values(LocalAplicacaoInsulina);
    const ladosDisponiveis = Object.values(LadoAplicacaoInsulina);
    // Quadrantes são opcionais e dependem da granularidade desejada.
    // Se você não usar quadrantes para todos os locais, ajuste esta lista.
    const quadrantesDisponiveis: (QuadranteAplicacaoInsulina | null)[] = [
      ...Object.values(QuadranteAplicacaoInsulina),
      null, // Inclui a opção de não ter quadrante
    ];

    // Buscar um número razoável das últimas aplicações para análise.
    // O número 30 é um bom ponto de partida, cobrindo um mês.
    const ultimasAplicacoes = await this.aplicacaoInsulinaService.findUltimasAplicacoes(
      usuarioId,
      30,
    );

    // Mapear os pontos de aplicação e a data da última vez que foram usados
    // Chave: "local-lado-quadrante" (ex: "abdome-direito-superior-direito")
    const pontosUsadosRecentemente = new Map<string, Date>();
    for (const aplicacao of ultimasAplicacoes) {
      const key = `${aplicacao.localAplicacao}-${aplicacao.ladoAplicacao}-${aplicacao.quadranteAplicacao || 'nulo'}`;
      const dataAtualAplicacao = aplicacao.dataHoraAplicacao;
      
      // Se dataHoraAplicacao é string, converta para Date antes de comparar
      const dataAtualAplicacaoDate = new Date(dataAtualAplicacao);
      
      if (
        !pontosUsadosRecentemente.has(key) ||
        dataAtualAplicacaoDate > pontosUsadosRecentemente.get(key)!
      ) {
        pontosUsadosRecentemente.set(key, dataAtualAplicacaoDate);
      }
    }

    // Definir o limite de tempo para reuso (14 dias)
    const limiteReuso = new Date();
    limiteReuso.setDate(limiteReuso.getDate() - 14); // 14 dias atrás

    // Tentar encontrar um ponto que não foi usado nos últimos 14 dias
    for (const local of locaisDisponiveis) {
      for (const lado of ladosDisponiveis) {
        for (const quadrante of quadrantesDisponiveis) {
          const key = `${local}-${lado}-${quadrante || 'nulo'}`;
          if (!pontosUsadosRecentemente.has(key) || pontosUsadosRecentemente.get(key)! < limiteReuso) {
            // Encontrou um ponto que está livre ou foi usado há mais de 14 dias
            return { local, lado, quadrante };
          }
        }
      }
    }

    // Se todos os pontos possíveis foram usados nos últimos 14 dias (cenário raro para 30+ pontos):
    // Retornar o ponto menos recentemente usado para minimizar o impacto.
    let pontoMenosRecente: { local: LocalAplicacaoInsulina; lado: LadoAplicacaoInsulina; quadrante: QuadranteAplicacaoInsulina | null } | null = null;
    let dataMenosRecente: Date | null = null;

    for (const local of locaisDisponiveis) {
      for (const lado of ladosDisponiveis) {
        for (const quadrante of quadrantesDisponiveis) {
          const key = `${local}-${lado}-${quadrante || 'nulo'}`;
          const dataUso = pontosUsadosRecentemente.get(key);

          if (dataUso) {
            if (!dataMenosRecente || dataUso < dataMenosRecente) {
              dataMenosRecente = dataUso;
              pontoMenosRecente = { local, lado, quadrante };
            }
          }
        }
      }
    }

    if (pontoMenosRecente) {
      console.warn(`[Rodízio Insulina] Todos os pontos foram usados nos últimos 14 dias. Sugerindo o ponto menos recente: ${pontoMenosRecente.local}, ${pontoMenosRecente.lado}, ${pontoMenosRecente.quadrante || 'sem quadrante'} (último uso: ${dataMenosRecente?.toLocaleDateString()}).`);
      return pontoMenosRecente;
    }

    // Fallback caso não haja nenhuma aplicação anterior ou se a lógica falhar (improvável)
    console.warn("[Rodízio Insulina] Não foi possível encontrar uma sugestão baseada no histórico. Sugerindo padrão: Abdome Direito, Superior-Direito.");
    return {
      local: LocalAplicacaoInsulina.ABDOME,
      lado: LadoAplicacaoInsulina.DIREITO,
      quadrante: QuadranteAplicacaoInsulina.SUPERIOR_DIREITO,
    };
  }
}