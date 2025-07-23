import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AplicacaoInsulinaService } from './services/aplicacao-insulina.service';
import { CreateAplicacaoInsulinaDto } from './dto/create-aplicacao-insulina.dto';
import { UpdateAplicacaoInsulinaDto } from './dto/update-aplicacao-insulina.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiNotFoundResponse, ApiBody } from '@nestjs/swagger';
import { ListAplicacaoInsulinaDto } from './dto/list-aplicacao-insulina.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CalculadoraCorrecaoGlicemiaService } from './services/calculadora-correcao-glicemia.service';
import { CalcularBolusDto } from './dto/calcular-bolus.dto';
import type { AplicacaoInsulina } from './entities/aplicacao-insulina.entity';

@ApiTags('aplicacao-insulina')
@ApiBearerAuth('bearer')
@UseGuards(AuthGuard)
@Controller('aplicacao-insulina')
export class AplicacaoInsulinaController {
  constructor(
    private readonly aplicacaoInsulinaService: AplicacaoInsulinaService,
    private readonly calculadoraCorrecaoGlicemiaService: CalculadoraCorrecaoGlicemiaService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova aplicação de insulina' })
  @ApiCreatedResponse({ description: 'Aplicação de insulina criada com sucesso', type: ListAplicacaoInsulinaDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiBody({ type: CreateAplicacaoInsulinaDto, description: 'Dados para criar uma nova aplicação de insulina' })
  async create(@Body() createAplicacaoInsulinaDto: CreateAplicacaoInsulinaDto): Promise<ListAplicacaoInsulinaDto> {
    return this.mapToDto(await this.aplicacaoInsulinaService.create(createAplicacaoInsulinaDto));
  }
  
  @Post('calcular-bolus')
  @ApiOperation({ summary: 'Calcula o bolus de correção de glicemia para um usuário' })
  @ApiOkResponse({
    description: 'Bolus de correção calculado com sucesso',
    schema: {
      properties: {
        bolusCorrecao: { type: 'number', example: 2.5 }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado ou dados insuficientes para cálculo' })
  @ApiBody({ type: CalcularBolusDto, description: 'Dados para calcular o bolus de correção' })
  async calcularBolus(
    @Body() calcularBolusDto: CalcularBolusDto,
  ) {
    try {
      const bolus = await this.calculadoraCorrecaoGlicemiaService.calcularBolusCorrecao(
        calcularBolusDto.usuarioId,
        calcularBolusDto?.glicoseAtual,
        calcularBolusDto?.glicemiaId,
      );
      return { bolusCorrecao: bolus };
    } catch (error) {
      console.error(error)
      if (error instanceof HttpException) {
        throw error; 
      }
      
      throw new HttpException(error.message || 'Erro interno ao calcular bolus.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Lista todas as aplicações de insulina de um usuário' })
    @ApiOkResponse({
        description: 'Aplicações de insulina encontradas',
        type: ListAplicacaoInsulinaDto,
        isArray: true,
        schema: {
            properties: {
                aplicacoes: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ListAplicacaoInsulinaDto' }
                }
            }
        }
    })
  @ApiNotFoundResponse({ description: 'Nenhuma aplicação de insulina encontrada para o usuário' })
  async findAll(@Param('usuarioId') usuarioId: string) {
    const aplicacoes = await this.aplicacaoInsulinaService.findAll(usuarioId)
    return aplicacoes.map(aplicacao => this.mapToDto(aplicacao));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma aplicação de insulina pelo ID' })
  @ApiOkResponse({ description: 'Aplicação de insulina encontrada', type: ListAplicacaoInsulinaDto })
  @ApiNotFoundResponse({ description: 'Aplicação de insulina não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.mapToDto(await this.aplicacaoInsulinaService.findOne(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma aplicação de insulina pelo ID' })
  @ApiOkResponse({ description: 'Aplicação de insulina atualizada com sucesso', type: ListAplicacaoInsulinaDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiBody({ type: UpdateAplicacaoInsulinaDto, description: 'Dados para atualizar a aplicação de insulina' })
  @ApiNotFoundResponse({ description: 'Aplicação de insulina não encontrada' })
  async update(@Param('id') id: string, @Body() updateAplicacaoInsulinaDto: UpdateAplicacaoInsulinaDto): Promise<ListAplicacaoInsulinaDto> {
    return this.mapToDto(await this.aplicacaoInsulinaService.update(id, updateAplicacaoInsulinaDto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma aplicação de insulina pelo ID' })
  @ApiOkResponse({ description: 'Aplicação de insulina removida com sucesso' })
  @ApiNotFoundResponse({ description: 'Aplicação de insulina não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.aplicacaoInsulinaService.remove(id);
  }

  private mapToDto(aplicacao: AplicacaoInsulina): ListAplicacaoInsulinaDto {
    return {
      id: aplicacao.id,
      usuarioId: aplicacao.usuario?.id,
      quantidadeUnidades: aplicacao.quantidadeUnidades,
      insulinaId: aplicacao.insulinaAssociada?.id,
      nome: aplicacao.insulinaAssociada?.nome,
      tipoBasalCorrecao: aplicacao.insulinaAssociada?.tipoBasalCorrecao,
      duracaoAcaoHoras: aplicacao.insulinaAssociada?.duracaoAcaoHoras,
      picoAcaoHoras: aplicacao.insulinaAssociada?.picoAcaoHoras ?? undefined,
      insulinaAssociada: aplicacao.insulinaAssociada,
      dataHoraAplicacao: this.formatDate(aplicacao.dataHoraAplicacao, 'dd/MM/yyyy HH:mm'),
      createdAt: this.formatDate(aplicacao.createdAt, 'dd/MM/yyyy HH:mm'),
      updatedAt: this.formatDate(aplicacao.updatedAt, 'dd/MM/yyyy HH:mm'),
    };
  }


  private formatDate(date: string, format: string): string {
    const data = new Date(date);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear());
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');

    if (format === 'dd/MM/yyyy HH:mm') {
      return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    } else if (format === 'dd/MM/yyyy') {
      return `${dia}/${mes}/${ano}`;
    }

    return date;
  }
}