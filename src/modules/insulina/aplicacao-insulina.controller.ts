import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AplicacaoInsulinaService } from './services/aplicacao-insulina.service';
import { CreateAplicacaoInsulinaDto } from './dto/create-aplicacao-insulina.dto';
import { UpdateAplicacaoInsulinaDto } from './dto/update-aplicacao-insulina.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiNotFoundResponse, ApiBody } from '@nestjs/swagger';
import { ListAplicacaoInsulinaDto } from './dto/list-aplicacao-insulina.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CalculadoraCorrecaoGlicemiaService } from './services/calculadora-correcao-glicemia.service';
import { CalcularBolusDto } from './dto/calcular-bolus.dto';

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
    return this.aplicacaoInsulinaService.create(createAplicacaoInsulinaDto);
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
        calcularBolusDto.glicoseAtual,
      );
      return { bolusCorrecao: bolus };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-lança exceções HTTP pré-definidas (NotFound, etc.)
      }
      // Captura erros de validação ou lógicos do serviço
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
  async findAll(@Param('usuarioId') usuarioId: string): Promise<ListAplicacaoInsulinaDto[]> {
    return this.aplicacaoInsulinaService.findAll(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma aplicação de insulina pelo ID' })
  @ApiOkResponse({ description: 'Aplicação de insulina encontrada', type: ListAplicacaoInsulinaDto })
  @ApiNotFoundResponse({ description: 'Aplicação de insulina não encontrada' })
  async findOne(@Param('id') id: string): Promise<ListAplicacaoInsulinaDto> {
    return this.aplicacaoInsulinaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma aplicação de insulina pelo ID' })
  @ApiOkResponse({ description: 'Aplicação de insulina atualizada com sucesso', type: ListAplicacaoInsulinaDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiBody({ type: UpdateAplicacaoInsulinaDto, description: 'Dados para atualizar a aplicação de insulina' })
  @ApiNotFoundResponse({ description: 'Aplicação de insulina não encontrada' })
  async update(@Param('id') id: string, @Body() updateAplicacaoInsulinaDto: UpdateAplicacaoInsulinaDto): Promise<ListAplicacaoInsulinaDto> {
    return this.aplicacaoInsulinaService.update(id, updateAplicacaoInsulinaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma aplicação de insulina pelo ID' })
  @ApiOkResponse({ description: 'Aplicação de insulina removida com sucesso' })
  @ApiNotFoundResponse({ description: 'Aplicação de insulina não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.aplicacaoInsulinaService.remove(id);
  }
}