import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlicemiaEntity } from './entities/glicemia.entity';
import { CreateGlicemiaDto } from './dto/create-glicemia.dto';
import { UpdateGlicemiaDto } from './dto/update-glicemia.dto';
import { Repository } from 'typeorm';

@Injectable()
export class GlicemiaService {
  constructor(
    @InjectRepository(GlicemiaEntity)
    private readonly glicemiaRepository: Repository<GlicemiaEntity>,
  ) {}

  async criar(createGlicemiaDto: CreateGlicemiaDto): Promise<GlicemiaEntity> {
    const glicemia = this.glicemiaRepository.create({
      ...createGlicemiaDto,
      usuario: { id: createGlicemiaDto.usuarioId } as any,
    });
    return this.glicemiaRepository.save(glicemia);
  }
  async atualizar(usuarioId: string, updateGlicemiaDto: UpdateGlicemiaDto): Promise<GlicemiaEntity> {
    await this.glicemiaRepository.update(updateGlicemiaDto.id, {
      ...updateGlicemiaDto,
    });
    return this.buscarPor(usuarioId, { id: updateGlicemiaDto.id });
  }

  async remover(id: string): Promise<void> {
    await this.glicemiaRepository.delete(id);
  }

  async listarTodosDoUsuario(usuarioId: string): Promise<GlicemiaEntity[]> {
    return this.glicemiaRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'], // Carrega o relacionamento 'usuario'
    });
  }

  async buscarPor(usuarioId: string, where: { [key: string]: string }): Promise<GlicemiaEntity> {
    const glicemia = await this.glicemiaRepository.findOne({ 
      where: { ...where, usuario: { id: usuarioId } },
      relations: ['usuario'] // Carrega o relacionamento 'usuario'
    });
    if (!glicemia) throw new NotFoundException('Glicemia não encontrada');
    return glicemia;
  }
}

