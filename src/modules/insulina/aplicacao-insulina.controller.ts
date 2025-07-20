import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AplicacaoInsulinaService } from './aplicacao-insulina.service';
import { CreateAplicacaoInsulinaDto } from './dto/create-aplicacao-insulina.dto';
import { UpdateAplicacaoInsulinaDto } from './dto/update-aplicacao-insulina.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ListAplicacaoInsulinaDto } from './dto/list-aplicacao-insulina.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('aplicacao-insulina')
@ApiBearerAuth('bearer')
@UseGuards(AuthGuard)
@Controller('aplicacao-insulina')
export class AplicacaoInsulinaController {
  constructor(private readonly aplicacaoInsulinaService: AplicacaoInsulinaService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova aplicação de insulina' })
  @ApiCreatedResponse({ description: 'Aplicação de insulina criada com sucesso', type: ListAplicacaoInsulinaDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  async create(@Body() createAplicacaoInsulinaDto: CreateAplicacaoInsulinaDto): Promise<ListAplicacaoInsulinaDto> {
    return this.aplicacaoInsulinaService.create(createAplicacaoInsulinaDto);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Lista todas as aplicações de insulina de um usuário' })
  @ApiOkResponse({ description: 'Aplicações de insulina encontradas', type: [ListAplicacaoInsulinaDto] })
  @ApiNotFoundResponse({ description: 'Nenhuma aplicação de insulina encontrada para o usuário' })
  findAll(@Param('usuarioId') usuarioId: string): Promise<ListAplicacaoInsulinaDto[]> {
    return this.aplicacaoInsulinaService.findAll(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma aplicação de insulina pelo ID' })
  @ApiOkResponse({ description: 'Aplicação de insulina encontrada', type: ListAplicacaoInsulinaDto })
  @ApiNotFoundResponse({ description: 'Aplicação de insulina não encontrada' })
  findOne(@Param('id') id: string): Promise<ListAplicacaoInsulinaDto> {
    return this.aplicacaoInsulinaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma aplicação de insulina pelo ID' })
  @ApiOkResponse({ description: 'Aplicação de insulina atualizada com sucesso', type: ListAplicacaoInsulinaDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiNotFoundResponse({ description: 'Aplicação de insulina não encontrada' })
  update(@Param('id') id: string, @Body() updateAplicacaoInsulinaDto: UpdateAplicacaoInsulinaDto): Promise<ListAplicacaoInsulinaDto> {
    return this.aplicacaoInsulinaService.update(id, updateAplicacaoInsulinaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma aplicação de insulina pelo ID' })
  @ApiOkResponse({ description: 'Aplicação de insulina removida com sucesso' })
  @ApiNotFoundResponse({ description: 'Aplicação de insulina não encontrada' })
  remove(@Param('id') id: string): Promise<void> {
    return this.aplicacaoInsulinaService.remove(id);
  }
}