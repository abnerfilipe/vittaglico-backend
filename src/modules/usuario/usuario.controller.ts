import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiExtraModels,
  getSchemaPath,
  ApiQuery,
} from '@nestjs/swagger';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';
import { UsuarioService } from './usuario.service';
import { Public } from '../../core/decorators/public.decorator';
import { UsuarioEntity } from './usuario.entity';
import { CriaUsuarioResponseDTO } from './dto/CriaUsuarioResponse.dto'; // Você precisará criar este DTO
import { ListaUsuariosResponseDTO } from './dto/ListaUsuariosResponse.dto'; // Você precisará criar este DTO
import { AtualizaUsuarioResponseDTO } from './dto/AtualizaUsuarioResponse.dto'; // Você precisará criar este DTO
import { RemoveUsuarioResponseDTO } from './dto/RemoveUsuarioResponse.dto'; // Você precisará criar este DTO
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';
import { HashearSenhaPipe } from 'src/core/pipes/hashear-senha.pipe';

@ApiTags('usuario')
@ApiExtraModels(
  ListaUsuarioDTO, 
  CriaUsuarioDTO, 
  AtualizaUsuarioDTO, 
  CriaUsuarioResponseDTO, 
  ListaUsuariosResponseDTO, 
  AtualizaUsuarioResponseDTO, 
  RemoveUsuarioResponseDTO
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
    schema: {
      example: {
        messagem: 'usuário criado com sucesso',
        usuario: {
          id: 'uuid',
          nome: 'João',
          email: 'joao@email.com',
          dataDeNascimento: '1990-01-01',
          telefone: '11999999999',
          createdAt: '2025-07-15T10:30:00Z',
          updatedAt: '2025-07-15T10:30:00Z',
        }
      }
    }
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

    return {
      messagem: 'usuário criado com sucesso',
      usuario: new ListaUsuarioDTO(
        usuarioCriado.id,
        usuarioCriado.nome,
        usuarioCriado.email,
        usuarioCriado.dataDeNascimento,
        usuarioCriado.telefone,
        usuarioCriado.createdAt,
        usuarioCriado.updatedAt,
      ),
    };
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
    schema: {
      properties: {
        mensagem: { 
          type: 'string', 
          example: 'Usuários obtidos com sucesso.'
        },
        usuarios: { 
          type: 'array',
          items: { $ref: getSchemaPath(ListaUsuarioDTO) }
        }
      }
    }
  })
  async listUsuarios() {
    const usuariosSalvos = await this.usuarioService.listUsuarios();

    return {
      mensagem: 'Usuários obtidos com sucesso.',
      usuarios: usuariosSalvos,
    };
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
    schema: {
      example: {
        messagem: 'usuário atualizado com sucesso',
        usuario: {
          id: 'uuid',
          nome: 'João',
          email: 'joao@email.com',
          dataDeNascimento: '1990-01-01',
          telefone: '11999999999',
          aceiteTermosCondicoes: true,
          aceitePoliticaDePrivacidade: true,
          createdAt: '2025-07-15T10:30:00Z',
          updatedAt: '2025-07-15T10:30:00Z',
        },
      },
    },
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
    const token = authorization?.replace('Bearer ', '')[0];
    const usuarioId = await this.usuarioService.buscarUsuarioIdPeloTokens(token);
    if (!usuarioId) {
      throw new NotFoundException('Usuário autenticado não encontrado.');
    }

    const usuarioAtualizado = await this.usuarioService.atualizaUsuario(
      usuarioId,
      novosDados,
    );

    return {
      messagem: 'usuário atualizado com sucesso',
      usuario: usuarioAtualizado,
    };
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
    schema: {
      example: {
        messagem: 'usuário removido com sucesso',
        usuario: {
          id: 'uuid',
          nome: 'João',
          email: 'joao@email.com',
          dataDeNascimento: '1990-01-01',
          telefone: '11999999999',
          createdAt: '2025-07-15T10:30:00Z',
          updatedAt: '2025-07-15T10:30:00Z',
        }
      }
    }
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

    return {
      messagem: 'usuário removido com sucesso',
      usuario: usuarioRemovido,
    };
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
    schema: {
      example: {
        id: 'uuid',
        nome: 'João',
        email: 'joao@email.com',
        dataDeNascimento: '1990-01-01',
        telefone: '11999999999',
        createdAt: '2025-07-15T10:30:00Z',
        updatedAt: '2025-07-15T10:30:00Z',
      }
    }
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
    
    return new ListaUsuarioDTO(
      usuario.id,
      usuario.nome,
      usuario.email,
      usuario.dataDeNascimento,
      usuario.telefone,
      usuario.createdAt,
      usuario.updatedAt,
    );
  }
}