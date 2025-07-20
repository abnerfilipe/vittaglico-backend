import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AplicacaoInsulina } from './entities/aplicacao-insulina.entity';
import { CreateAplicacaoInsulinaDto } from './dto/create-aplicacao-insulina.dto';
import { UpdateAplicacaoInsulinaDto } from './dto/update-aplicacao-insulina.dto';
import { ListAplicacaoInsulinaDto } from './dto/list-aplicacao-insulina.dto';

@Injectable()
export class AplicacaoInsulinaService {
  constructor(
    @InjectRepository(AplicacaoInsulina)
    private readonly aplicacaoInsulinaRepository: Repository<AplicacaoInsulina>,
  ) {}

  async create(createAplicacaoInsulinaDto: CreateAplicacaoInsulinaDto): Promise<ListAplicacaoInsulinaDto> {
    const aplicacaoInsulina = await this.aplicacaoInsulinaRepository.save(this.aplicacaoInsulinaRepository.create(createAplicacaoInsulinaDto));
    return {
      id: aplicacaoInsulina.id,
      quantidadeUnidades: aplicacaoInsulina.quantidadeUnidades,
      dataHoraAplicacao: aplicacaoInsulina.dataHoraAplicacao,
      usuarioId: aplicacaoInsulina.usuarioId,
      insulinaId: aplicacaoInsulina.insulinaId ?? undefined,
    };
  }

  async findAll(usuarioId: string): Promise<ListAplicacaoInsulinaDto[]> {
    const aplicacoesInsulina = await this.aplicacaoInsulinaRepository.find({ where: { usuarioId } });
    return aplicacoesInsulina.map(aplicacaoInsulina => ({
      id: aplicacaoInsulina.id,
      quantidadeUnidades: aplicacaoInsulina.quantidadeUnidades,
      dataHoraAplicacao: aplicacaoInsulina.dataHoraAplicacao,
      usuarioId: aplicacaoInsulina.usuarioId,
      insulinaId: aplicacaoInsulina.insulinaId ?? undefined,
    }));
  }

  async findOne(id: string): Promise<ListAplicacaoInsulinaDto> {
    const aplicacaoInsulina = await this.aplicacaoInsulinaRepository.findOneBy({ id });
    if (!aplicacaoInsulina) {
      throw new NotFoundException(`Aplicação de insulina com ID ${id} não encontrada`);
    }
    return {
      id: aplicacaoInsulina.id,
      quantidadeUnidades: aplicacaoInsulina.quantidadeUnidades,
      dataHoraAplicacao: aplicacaoInsulina.dataHoraAplicacao,
      usuarioId: aplicacaoInsulina.usuarioId,
      insulinaId: aplicacaoInsulina.insulinaId ?? undefined,
    };
  }

async update(id: string, updateAplicacaoInsulinaDto: UpdateAplicacaoInsulinaDto): Promise<ListAplicacaoInsulinaDto> {
    const aplicacaoInsulina = await this.aplicacaoInsulinaRepository.findOneBy({ id });
    if (!aplicacaoInsulina) {
      throw new NotFoundException(`Aplicação de insulina com ID ${id} não encontrada`);
    }
    await this.aplicacaoInsulinaRepository.update(id, updateAplicacaoInsulinaDto);
    const aplicacaoInsulinaAtualizada = await this.aplicacaoInsulinaRepository.findOneBy({ id });

    if (!aplicacaoInsulinaAtualizada) {
        throw new NotFoundException(`Aplicação de insulina com ID ${id} não encontrada após a atualização`);
    }

    return {
      id: aplicacaoInsulinaAtualizada.id,
      quantidadeUnidades: aplicacaoInsulinaAtualizada.quantidadeUnidades,
      dataHoraAplicacao: aplicacaoInsulinaAtualizada.dataHoraAplicacao,
      usuarioId: aplicacaoInsulinaAtualizada.usuarioId,
      insulinaId: aplicacaoInsulinaAtualizada.insulinaId ?? undefined,
    };
  }

  async remove(id: string): Promise<void> {
    const aplicacaoInsulina = await this.aplicacaoInsulinaRepository.findOneBy({ id });
    if (!aplicacaoInsulina) {
      throw new NotFoundException(`Aplicação de insulina com ID ${id} não encontrada`);
    }
    await this.aplicacaoInsulinaRepository.delete(id);
  }
}