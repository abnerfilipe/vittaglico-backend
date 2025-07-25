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
import type { SugestaoLocalRodizio } from "../interfaces/sugestaoLocalRodizio.interface";
import { LOCAL_QUADRANTE_MAP } from "../constants/rodizio.constants";

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
      
      const glicemiaEspecifica = await this.glicemiaService.buscarPor(usuarioId, { id: glicemiaId });
      if (!glicemiaEspecifica) {
        throw new NotFoundException('Glicemia especificada não foi encontrada.');
      }
      glicemia = glicemiaEspecifica;
      glicemiaIdParaSalvar = glicemiaId;
    } else if (valorGlicemiaAtual !== undefined && valorGlicemiaAtual !== null) {
      
      glicemia = new Glicemia();
      glicemia.valor = valorGlicemiaAtual;
      glicemia.usuarioId = usuarioId;
    } else {
      
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

    
    const correcaoBruta = (glicoseAtual - glicoseAlvo) / fsi;

    
    const dataHoraAtual = new Date();
    const aplicacoesRecentes = await this.aplicacaoInsulinaService.findAtivasByUsuarioId(usuarioId, dataHoraAtual);

    const insulinaAtiva = this.calcularInsulinaAtiva(aplicacoesRecentes, dataHoraAtual);

    
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
   * Retorna um array de locais de aplicação de insulina disponíveis,
   * priorizando aqueles não usados nos últimos 14 dias.
   *
   * @param usuarioId O ID do usuário para quem as sugestões serão geradas.
   * @returns Um array de objetos SugestaoLocalRodizio.
   * @throws NotFoundException se o usuário não for encontrado.
   */
async obterLocaisRodizioDisponiveis(usuarioId: string): Promise<SugestaoLocalRodizio[]> {
    const usuario = await this.usuarioService.buscaPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado.`);
    }

    const ultimasAplicacoes = await this.aplicacaoInsulinaService.findUltimasAplicacoes(
      usuarioId,
      50,
    );

    const pontosUsadosRecentemente = new Map<string, Date>();
    for (const aplicacao of ultimasAplicacoes) {
      
      
      const key = `${aplicacao.localAplicacao}-${aplicacao.ladoAplicacao}-${aplicacao.quadranteAplicacao || 'NÃO_DEFINIDO'}`; 
      const dataAtualAplicacaoDate = new Date(aplicacao.dataHoraAplicacao);

      if (!pontosUsadosRecentemente.has(key) || dataAtualAplicacaoDate > pontosUsadosRecentemente.get(key)!) {
        pontosUsadosRecentemente.set(key, dataAtualAplicacaoDate);
      }
    }

    const limiteReuso = new Date();
    limiteReuso.setDate(limiteReuso.getDate() - 14);

    const locaisDisponiveisOrdenados: SugestaoLocalRodizio[] = [];
    const locaisUsadosRecentemente: SugestaoLocalRodizio[] = [];

    for (const localKey of Object.values(LocalAplicacaoInsulina)) {
      const ladosDoLocal = LOCAL_QUADRANTE_MAP[localKey];

      for (const ladoKey of Object.values(LadoAplicacaoInsulina)) {
        const quadrantesValidos = ladosDoLocal[ladoKey];

        if (quadrantesValidos && quadrantesValidos.length > 0) { 
          for (const quadrante of quadrantesValidos) {
            const key = `${localKey}-${ladoKey}-${quadrante}`; 
            const dataUso = pontosUsadosRecentemente.get(key);

            const sugestao: SugestaoLocalRodizio = {
              local: localKey,
              lado: ladoKey,
              quadrante: quadrante,
              ultimoUso: dataUso,
            };

            if (!dataUso || dataUso < limiteReuso) {
              locaisDisponiveisOrdenados.push(sugestao);
            } else {
              locaisUsadosRecentemente.push(sugestao);
            }
          }
        }
      }
    }

    locaisDisponiveisOrdenados.sort((a, b) => {
      const dateA = a.ultimoUso ? a.ultimoUso.getTime() : 0;
      const dateB = b.ultimoUso ? b.ultimoUso.getTime() : 0; 
      return dateA - dateB;
    });

    if (locaisDisponiveisOrdenados.length === 0 && locaisUsadosRecentemente.length > 0) {
        console.warn("[Rodízio Insulina] Todos os pontos válidos foram usados nos últimos 14 dias. Retornando os menos recentes.");
        locaisUsadosRecentemente.sort((a, b) => (a.ultimoUso?.getTime() || 0) - (b.ultimoUso?.getTime() || 0));
        return locaisUsadosRecentemente;
    }

    if (locaisDisponiveisOrdenados.length > 0) {
        return locaisDisponiveisOrdenados;
    }

    console.warn("[Rodízio Insulina] Nenhum local disponível ou histórico encontrado para os padrões definidos. Retornando uma sugestão padrão.");
    
    return [{
      local: LocalAplicacaoInsulina.ABDOME,
      lado: LadoAplicacaoInsulina.DIREITO,
      quadrante: QuadranteAplicacaoInsulina.CENTRAL,
    }];
  }
}