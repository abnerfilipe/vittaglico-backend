import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { AtualizaUsuarioResponseDTO } from './dto/AtualizaUsuarioResponse.dto';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { CriaUsuarioResponseDTO } from './dto/CriaUsuarioResponse.dto';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';
import { ListaUsuariosResponseDTO } from './dto/ListaUsuariosResponse.dto';
import { RemoveUsuarioResponseDTO } from './dto/RemoveUsuarioResponse.dto';
import { UsuarioService } from './usuario.service';
import { HashearSenhaPipe } from '../../core/pipes/hashear-senha.pipe';
import { ConfiguracoesInsulinaDTO } from './dto/ConfiguracoesInsulina.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('usuario')
@ApiExtraModels(
  ListaUsuarioDTO, 
  CriaUsuarioDTO, 
  AtualizaUsuarioDTO, 
  CriaUsuarioResponseDTO, 
  ListaUsuariosResponseDTO, 
  AtualizaUsuarioResponseDTO, 
  RemoveUsuarioResponseDTO,
  ConfiguracoesInsulinaDTO // Adicione ConfiguracoesInsulinaDTO aqui
)
@ApiBearerAuth('bearer')
@Controller('/usuario')
export class UsuarioController {
  constructor(
    private usuarioService: UsuarioService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ 
    summary: 'Cria um novo usuário', 
    description: 'Cria um novo usuário no sistema com os dados fornecidos. A senha é automaticamente hasheada antes de ser armazenada.'
  })
  @ApiBody({ 
    type: CriaUsuarioDTO,
    description: 'Dados do usuário a ser criado',
    required: true
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso.',
    type: CriaUsuarioResponseDTO,
  })
  @ApiBadRequestResponse({ 
    description: 'Dados inválidos para criação.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'O nome não pode ser vazio',
          'O e-mail informado é inválido',
          'A senha precisa ter pelo menos 6 caracteres',
          'O telefone deve ter entre 8 e 20 caracteres',
          'A data de nascimento deve ser uma data válida (DD/MM/AAAA)'
        ],
        error: 'Bad Request'
      }
    }
  })
  async criaUsuario(
    @Body() { senha, ...dadosDoUsuario }: CriaUsuarioDTO,
    @Body('senha', HashearSenhaPipe) senhaHasheada: string,
  ) {
    const usuarioCriado = await this.usuarioService.criaUsuario({
      ...dadosDoUsuario,
      senha: senhaHasheada,
    });

    const listaUsuario = new ListaUsuarioDTO()
    listaUsuario.id = usuarioCriado.id
    listaUsuario.nome = usuarioCriado.nome
    listaUsuario.email = usuarioCriado.email
    listaUsuario.dataDeNascimento = usuarioCriado.dataDeNascimento
    listaUsuario.telefone = usuarioCriado.telefone
    listaUsuario.createdAt = usuarioCriado.createdAt
    listaUsuario.updatedAt = usuarioCriado.updatedAt
    listaUsuario.configuracoesInsulina = usuarioCriado.configuracoesInsulina ? plainToInstance(ConfiguracoesInsulinaDTO, usuarioCriado.configuracoesInsulina) : undefined

    const criaUsuarioResponse = new CriaUsuarioResponseDTO()
    criaUsuarioResponse.messagem = 'usuário criado com sucesso'
    criaUsuarioResponse.usuario = listaUsuario

    return criaUsuarioResponse
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lista todos os usuários',
    description: 'Retorna uma lista de todos os usuários cadastrados no sistema.'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página de resultados',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número de usuários por página',
    example: 10
  })
  @ApiOkResponse({
    description: 'Usuários obtidos com sucesso.',
    type: ListaUsuariosResponseDTO,
  })
  async listUsuarios() {
    const usuariosSalvos = await this.usuarioService.listUsuarios();

    const listaUsuariosResponse = new ListaUsuariosResponseDTO()
    listaUsuariosResponse.mensagem = 'Usuários obtidos com sucesso.'
    listaUsuariosResponse.usuarios = usuariosSalvos.map(usuario => {
      const listaUsuario = new ListaUsuarioDTO()
      listaUsuario.id = usuario.id
      listaUsuario.nome = usuario.nome
      listaUsuario.email = usuario.email
      listaUsuario.dataDeNascimento = usuario.dataDeNascimento
      listaUsuario.telefone = usuario.telefone
      listaUsuario.createdAt = usuario.createdAt
      listaUsuario.updatedAt = usuario.updatedAt
      listaUsuario.configuracoesInsulina = usuario.configuracoesInsulina ? plainToInstance(ConfiguracoesInsulinaDTO, usuario.configuracoesInsulina) : undefined
      return listaUsuario
    })

    return listaUsuariosResponse
  }

  @Put()
  @ApiOperation({
    summary: 'Atualiza os dados do próprio usuário autenticado',
    description:
      'Permite que o usuário autenticado atualize seus próprios dados. O usuário é identificado pelo token JWT enviado no header.',
  })
  @ApiBody({
    type: AtualizaUsuarioDTO,
    description: 'Novos dados para atualizar o usuário autenticado',
    required: true,
  })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso.',
    type: AtualizaUsuarioResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'O usuário não foi encontrado.',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos para atualização.',
    schema: {
      example: {
        statusCode: 400,
        message: ['O e-mail informado é inválido'],
        error: 'Bad Request',
      },
    },
  })
  async atualizaUsuario(
    @Headers('Authorization') authorization: string,
    @Body() novosDados: AtualizaUsuarioDTO,
  ) {
    const token = authorization?.split(' ')[1];
    const usuarioId = await this.usuarioService.buscarUsuarioIdPeloTokens(token);
    if (!usuarioId) {
      throw new NotFoundException('Usuário autenticado não encontrado.');
    }
    
    const usuarioAtualizado = await this.usuarioService.atualizaUsuario(
      usuarioId,
      novosDados,
    );

    const listaUsuario = new ListaUsuarioDTO()
    listaUsuario.id = usuarioAtualizado.id
    listaUsuario.nome = usuarioAtualizado.nome
    listaUsuario.email = usuarioAtualizado.email
    listaUsuario.dataDeNascimento = usuarioAtualizado.dataDeNascimento
    listaUsuario.telefone = usuarioAtualizado.telefone
    listaUsuario.createdAt = usuarioAtualizado.createdAt
    listaUsuario.updatedAt = usuarioAtualizado.updatedAt
    listaUsuario.configuracoesInsulina = usuarioAtualizado.configuracoesInsulina ? plainToInstance(ConfiguracoesInsulinaDTO, usuarioAtualizado.configuracoesInsulina) : undefined

    const atualizaUsuarioResponse = new AtualizaUsuarioResponseDTO()
    atualizaUsuarioResponse.messagem = 'usuário atualizado com sucesso'
    atualizaUsuarioResponse.usuario = listaUsuario

    return atualizaUsuarioResponse
  }

  @Delete('/:id')
  @ApiOperation({ 
    summary: 'Remove um usuário pelo ID',
    description: 'Remove permanentemente um usuário do sistema pelo ID fornecido.'
  })
  @ApiParam({ 
    name: 'id', 
    type: String, 
    description: 'ID do usuário a ser removido', 
    example: 'uuid',
    required: true
  })
  @ApiOkResponse({
    description: 'Usuário removido com sucesso.',
    type: RemoveUsuarioResponseDTO,
  })
  @ApiNotFoundResponse({ 
    description: 'Usuário não encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'O usuário não foi encontrado',
        error: 'Not Found'
      }
    }
  })
  async removeUsuario(@Param('id') id: string) {
    const usuarioRemovido = await this.usuarioService.deletaUsuario(id);

    const listaUsuario = new ListaUsuarioDTO()
    listaUsuario.id = usuarioRemovido.id
    listaUsuario.nome = usuarioRemovido.nome
    listaUsuario.email = usuarioRemovido.email
    listaUsuario.dataDeNascimento = usuarioRemovido.dataDeNascimento
    listaUsuario.telefone = usuarioRemovido.telefone
    listaUsuario.createdAt = usuarioRemovido.createdAt
    listaUsuario.updatedAt = usuarioRemovido.updatedAt
    listaUsuario.configuracoesInsulina = usuarioRemovido.configuracoesInsulina ? plainToInstance(ConfiguracoesInsulinaDTO, usuarioRemovido.configuracoesInsulina) : undefined

    const removeUsuarioResponse = new RemoveUsuarioResponseDTO()
    removeUsuarioResponse.messagem = 'usuário removido com sucesso'

    return removeUsuarioResponse
  }

  @Get('/:id')
  @ApiOperation({ 
    summary: 'Busca um usuário pelo ID',
    description: 'Retorna os dados detalhados de um usuário específico pelo ID.'
  })
  @ApiParam({ 
    name: 'id', 
    type: String, 
    description: 'ID do usuário a ser buscado', 
    example: 'uuid',
    required: true
  })
  @ApiOkResponse({
    description: 'Usuário encontrado com sucesso.',
    type: ListaUsuarioDTO,
  })
  @ApiNotFoundResponse({ 
    description: 'Usuário não encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'O usuário não foi encontrado.',
        error: 'Not Found'
      }
    }
  })
  async buscaUsuarioPorId(@Param('id') id: string) {
    const usuario = await this.usuarioService.buscaPorId(id);
    
    const listaUsuario = new ListaUsuarioDTO()
    listaUsuario.id = usuario.id
    listaUsuario.nome = usuario.nome
    listaUsuario.email = usuario.email
    listaUsuario.dataDeNascimento = usuario.dataDeNascimento
    listaUsuario.telefone = usuario.telefone
    listaUsuario.createdAt = usuario.createdAt
    listaUsuario.updatedAt = usuario.updatedAt
    listaUsuario.configuracoesInsulina = usuario.configuracoesInsulina ? plainToInstance(ConfiguracoesInsulinaDTO, usuario.configuracoesInsulina) : undefined

    return listaUsuario
  }
}