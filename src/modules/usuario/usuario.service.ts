import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { TokenEntity } from '../auth/token.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(TokenEntity) 
    private readonly tokenRepository: Repository<TokenEntity>,
  ) { }

  async criaUsuario(dadosDoUsuario: CriaUsuarioDTO) {
    const usuarioEntity = new Usuario();

    Object.assign(usuarioEntity, dadosDoUsuario as Usuario);

    return this.usuarioRepository.save(usuarioEntity);
  }

  async listUsuarios() {
    const usuariosSalvos = await this.usuarioRepository.find();
    const usuariosLista = usuariosSalvos.map(
      (usuario) => new ListaUsuarioDTO(usuario.id, usuario.nome, usuario.email, usuario.dataDeNascimento, usuario.telefone, usuario?.createdAt, usuario?.updatedAt),
    );
    return usuariosLista;
  }

  async buscaPorEmail(email: string) {
    const checkEmail = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (checkEmail === null)
      throw new NotFoundException('O email não foi encontrado.');

    return checkEmail;
  }

  async buscaPorId(id: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (usuario === null)
      throw new NotFoundException('O usuário não foi encontrado.');
    return usuario;
  }
  
  async buscaPorNome(nome: string) {
    const usuario = await this.usuarioRepository.findOneBy({ nome });
    if (usuario === null)
      throw new NotFoundException('O usuário não foi encontrado.');
    return usuario;
  }

  async atualizaUsuario(id: string, novosDados: AtualizaUsuarioDTO) {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (usuario === null)
      throw new NotFoundException('O usuário não foi encontrado.');

    Object.assign(usuario, novosDados as Usuario);

    return this.usuarioRepository.save(usuario);
  }

  async deletaUsuario(id: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException('O usuário não foi encontrado');
    }

    await this.usuarioRepository.delete(usuario.id);

    return usuario;
  }
  async buscaPorTelefone(telefone: string) {
    const usuario = await this.usuarioRepository.findOneBy({ telefone });
    if (usuario === null)
      throw new NotFoundException('O usuário não foi encontrado.');
    return usuario;
  }
  async buscaPorDataDeNascimento(dataDeNascimento: string) {
    const usuario = await this.usuarioRepository.findOneBy({ dataDeNascimento });
    if (usuario === null)
      throw new NotFoundException('O usuário não foi encontrado.');
    return usuario;
  }

  async buscarUsuarioIdPeloTokens(token: string): Promise<string | null> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { token },
      select: ['usuarioId']
    });
    return tokenEntity ? tokenEntity.usuarioId : null;
  }

}
