import { UseGuards, Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiNotFoundResponse } from "@nestjs/swagger";
import { CreateInsulinaDto } from "./dto/create-insulina.dto";
import { ListInsulinaDto } from "./dto/list-insulina.dto";
import { UpdateInsulinaDto } from "./dto/update-insulina.dto";
import { InsulinaService } from "./insulina.service";
import { AuthGuard } from "../auth/auth.guard";

@ApiTags('insulina')
@ApiBearerAuth('bearer')
@UseGuards(AuthGuard)
@Controller('insulina')
export class InsulinaController {
  constructor(private readonly insulinaService: InsulinaService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova insulina' })
  @ApiCreatedResponse({ description: 'Insulina criada com sucesso', type: ListInsulinaDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  async create(@Body() createInsulinaDto: CreateInsulinaDto): Promise<ListInsulinaDto> {
    return this.insulinaService.create(createInsulinaDto);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Lista todas as insulinas de um usuário' })
  @ApiOkResponse({ description: 'Insulinas encontradas', type: [ListInsulinaDto] })
  @ApiNotFoundResponse({ description: 'Nenhuma insulina encontrada para o usuário' })
  findAll(@Param('usuarioId') usuarioId: string): Promise<ListInsulinaDto[]> {
    return this.insulinaService.findAll(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma insulina pelo ID' })
  @ApiOkResponse({ description: 'Insulina encontrada', type: ListInsulinaDto })
  @ApiNotFoundResponse({ description: 'Insulina não encontrada' })
  findOne(@Param('id') id: string): Promise<ListInsulinaDto> {
    return this.insulinaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma insulina pelo ID' })
  @ApiOkResponse({ description: 'Insulina atualizada com sucesso', type: ListInsulinaDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiNotFoundResponse({ description: 'Insulina não encontrada' })
  update(@Param('id') id: string, @Body() updateInsulinaDto: UpdateInsulinaDto): Promise<ListInsulinaDto> {
    return this.insulinaService.update(id, updateInsulinaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma insulina pelo ID' })
  @ApiOkResponse({ description: 'Insulina removida com sucesso' })
  @ApiNotFoundResponse({ description: 'Insulina não encontrada' })
  remove(@Param('id') id: string): Promise<void> {
    return this.insulinaService.remove(id);
  }
}