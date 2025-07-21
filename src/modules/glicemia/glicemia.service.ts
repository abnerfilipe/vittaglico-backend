import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Glicemia } from './entities/glicemia.entity';
import { CreateGlicemiaDto } from './dto/create-glicemia.dto';
import { UpdateGlicemiaDto } from './dto/update-glicemia.dto';
import { Repository } from 'typeorm';

@Injectable()
export class GlicemiaService {
  constructor(
    @InjectRepository(Glicemia)
    private readonly glicemiaRepository: Repository<Glicemia>,
  ) {}

  /**
   * Cria um novo registro de glicemia para o usuário.
   * @param createGlicemiaDto Dados para criação da glicemia.
   * @returns O registro de glicemia criado.
   */
  async criar(createGlicemiaDto: CreateGlicemiaDto): Promise<Glicemia> {
    const glicemia = this.glicemiaRepository.create({
      ...createGlicemiaDto,
      usuario: { id: createGlicemiaDto.usuarioId } as any,
    });
    return this.glicemiaRepository.save(glicemia);
  }

  /**
   * Atualiza um registro de glicemia existente.
   * @param usuarioId ID do usuário.
   * @param updateGlicemiaDto Dados para atualização da glicemia.
   * @returns O registro de glicemia atualizado.
   */
  async atualizar(usuarioId: string, updateGlicemiaDto: UpdateGlicemiaDto): Promise<Glicemia> {
    await this.glicemiaRepository.update(updateGlicemiaDto.id, {
      ...updateGlicemiaDto,
    });
    return this.buscarPor(usuarioId, { id: updateGlicemiaDto.id });
  }

  /**
   * Remove um registro de glicemia pelo ID.
   * @param id ID da glicemia.
   */
  async remover(id: string): Promise<void> {
    await this.glicemiaRepository.delete(id);
  }

  /**
   * Lista todos os registros de glicemia de um usuário.
   * @param usuarioId ID do usuário.
   * @returns Lista de glicemias do usuário.
   */
  async listarTodosDoUsuario(usuarioId: string): Promise<Glicemia[]> {
    return this.glicemiaRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'], 
    });
  }

  /**
   * Busca um registro de glicemia específico de um usuário.
   * @param usuarioId ID do usuário.
   * @param where Filtros de busca (ex: id da glicemia).
   * @returns O registro de glicemia encontrado.
   * @throws NotFoundException se não encontrar.
   */
  async buscarPor(usuarioId: string, where: { [key: string]: string }): Promise<Glicemia> {
    const glicemia = await this.glicemiaRepository.findOne({ 
      where: { ...where, usuario: { id: usuarioId } },
      relations: ['usuario'] 
    });
    if (!glicemia) throw new NotFoundException('Glicemia não encontrada');
    return glicemia;
  }

  /**
   * Busca a última glicemia registrada de um usuário.
   * @param usuarioId ID do usuário.
   * @returns O último registro de glicemia ou null se não houver.
   */
  async buscarUltimaGlicemia(usuarioId: string): Promise<Glicemia | null> {
    return this.glicemiaRepository.findOne({
      where: { usuario: { id: usuarioId } },
      order: { createdAt: 'DESC' },
    });
  }
}