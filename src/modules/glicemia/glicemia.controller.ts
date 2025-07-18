import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { GlicemiaService } from './glicemia.service';
import { CreateGlicemiaDto } from './dto/create-glicemia.dto';
import { UpdateGlicemiaDto } from './dto/update-glicemia.dto';
import { GlicemiaEntity } from './entities/glicemia.entity';
import { ListGlicemiaDto } from './dto/list-glicemia.dto';

@ApiTags('glicemia')
@ApiExtraModels(
  CreateGlicemiaDto,
  UpdateGlicemiaDto,
  GlicemiaEntity,
  ListGlicemiaDto,
)
@ApiBearerAuth('bearer')
@Controller('glicemia')
export class GlicemiaController {
  constructor(private readonly glicemiaService: GlicemiaService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo registro de glicemia' })
  @ApiBody({ type: CreateGlicemiaDto })
   @ApiCreatedResponse({
    description: 'Registro criado com sucesso.',
    schema: {
      properties: {
        messagem: { type: 'string', example: 'Glicemia criada com sucesso' },
        glicemia: { $ref: getSchemaPath(ListGlicemiaDto) },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos para criação' })
  async create(@Body() createGlicemiaDto: CreateGlicemiaDto) {
    const glicemia = await this.glicemiaService.criar(createGlicemiaDto);
    return this.mapToDto(glicemia);
  }

  @Get('/usuario/:usuarioId')
  @ApiOperation({ summary: 'Lista todos os registros de glicemia de um usuário' })
  @ApiParam({ name: 'usuarioId', type: String, description: 'ID do usuário' })
  @ApiOkResponse({
    description: 'Lista de glicemias',
    schema: {
      properties: {
        messagem: { type: 'string', example: 'Glicemias encontradas com sucesso' },
        glicemias: {
          type: 'array',
          items: { $ref: getSchemaPath(ListGlicemiaDto) },
        },
      },
    },
  })
  async findAll(@Param('usuarioId') usuarioId: string) {
    const glicemias = await this.glicemiaService.listarTodosDoUsuario(usuarioId);
    return glicemias.map((glicemia) => this.mapToDto(glicemia));
  }

  @Get(':id/usuario/:usuarioId')
  @ApiOperation({ summary: 'Busca um registro de glicemia pelo ID e usuário' })
  @ApiParam({ name: 'id', type: String, description: 'ID da glicemia' })
  @ApiParam({ name: 'usuarioId', type: String, description: 'ID do usuário' })
  @ApiOkResponse({
    description: 'Registro encontrado',
    schema: {
      properties: {
        messagem: { type: 'string', example: 'Glicemia encontrada com sucesso' },
        glicemia: { $ref: getSchemaPath(ListGlicemiaDto) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Registro não encontrado' })
  async findOne(@Param('id') id: string, @Param('usuarioId') usuarioId: string) {
    const glicemia = await this.glicemiaService.buscarPor(usuarioId, { id });
    return this.mapToDto(glicemia);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um registro de glicemia pelo ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID da glicemia' })
  @ApiBody({ type: UpdateGlicemiaDto })
  @ApiOkResponse({
    description: 'Registro atualizado',
    schema: {
      properties: {
        messagem: { type: 'string', example: 'Glicemia atualizada com sucesso' },
        glicemia: { $ref: getSchemaPath(ListGlicemiaDto) },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos para atualização' })
  @ApiNotFoundResponse({ description: 'Glicemia não encontrada' })
  async atualizar(@Param('id') id: string, @Body() updateGlicemiaDto: UpdateGlicemiaDto) {
    const glicemia = await this.glicemiaService.atualizar(id, updateGlicemiaDto);
    return this.mapToDto(glicemia);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um registro de glicemia pelo ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID da glicemia' })
  @ApiOkResponse({
    description: 'Registro removido',
    schema: {
      properties: {
        messagem: { type: 'string', example: 'Glicemia removida com sucesso' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Registro não encontrado' })
  async remover(@Param('id') id: string) {
    await this.glicemiaService.remover(id);
    return { message: 'Glicemia removida com sucesso' };
  }

  private mapToDto(glicemia: GlicemiaEntity): ListGlicemiaDto {
    return {
      id: glicemia.id,
      usuarioId: glicemia.usuario.id,
      valor: glicemia.valor,
      medida: glicemia.medida,
      periodo: glicemia.periodo,
      dataHoraDeRegistro: this.formatDate(glicemia.dataHoraDeRegistro, 'dd/MM/yyyy HH:mm'),
      createdAt: this.formatDate(glicemia.createdAt, 'dd/MM/yyyy HH:mm'),
      updatedAt: this.formatDate(glicemia.updatedAt, 'dd/MM/yyyy HH:mm'),
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