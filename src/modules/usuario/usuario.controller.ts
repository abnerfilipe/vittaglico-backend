import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { HashearSenhaPipe } from '../../recursos/pipes/hashear-senha.pipe';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';
import { UsuarioService } from './usuario.service';
import { Public } from '../auth/decorators/public.decorator';
import { UsuarioEntity } from './usuario.entity';

@ApiTags('usuario')
@Controller('/usuario')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({ type: CriaUsuarioDTO })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso.',
    type: UsuarioEntity,
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
      usuario: new ListaUsuarioDTO(usuarioCriado.id, usuarioCriado.nome),
    };
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiOkResponse({
    description: 'Usuários obtidos com sucesso.',
    type: [UsuarioEntity],
  })
  async listUsuarios() {
    const usuariosSalvos = await this.usuarioService.listUsuarios();

    return {
      mensagem: 'Usuários obtidos com sucesso.',
      usuarios: usuariosSalvos,
    };
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualiza um usuário pelo ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
  @ApiBody({ type: AtualizaUsuarioDTO })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso.',
    type: UsuarioEntity,
  })
  async atualizaUsuario(
    @Param('id') id: string,
    @Body() novosDados: AtualizaUsuarioDTO,
  ) {
    const usuarioAtualizado = await this.usuarioService.atualizaUsuario(
      id,
      novosDados,
    );

    return {
      messagem: 'usuário atualizado com sucesso',
      usuario: usuarioAtualizado,
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remove um usuário pelo ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
  @ApiOkResponse({
    description: 'Usuário removido com sucesso.',
    type: UsuarioEntity,
  })
  async removeUsuario(@Param('id') id: string) {
    const usuarioRemovido = await this.usuarioService.deletaUsuario(id);

    return {
      messagem: 'usuário removido com suceso',
      usuario: usuarioRemovido,
    };
  }
}