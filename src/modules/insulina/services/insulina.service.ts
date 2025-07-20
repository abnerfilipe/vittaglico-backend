import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateInsulinaDto } from "../dto/create-insulina.dto";
import { ListInsulinaDto } from "../dto/list-insulina.dto";
import { UpdateInsulinaDto } from "../dto/update-insulina.dto";
import { Insulina } from "../entities/insulina.entity";

@Injectable()
export class InsulinaService {
  constructor(
    @InjectRepository(Insulina)
    private readonly insulinaRepository: Repository<Insulina>,
  ) {}

  async create(createInsulinaDto: CreateInsulinaDto): Promise<ListInsulinaDto> {
    const insulina = await this.insulinaRepository.save(this.insulinaRepository.create(createInsulinaDto));
    return {
      id: insulina.id,
      nome: insulina.nome,
      tipoBasalBolus: insulina.tipoBasalBolus,
      duracaoAcaoHoras: insulina.duracaoAcaoHoras,
      picoAcaoHoras: insulina.picoAcaoHoras ?? undefined,
      usuarioId: insulina.usuarioId,
    };
  }

  async findAll(usuarioId: string): Promise<ListInsulinaDto[]> {
    const insulinas = await this.insulinaRepository.find({ where: { usuarioId } });
    return insulinas.map(insulina => ({
      id: insulina.id,
      nome: insulina.nome,
      tipoBasalBolus: insulina.tipoBasalBolus,
      duracaoAcaoHoras: insulina.duracaoAcaoHoras,
      picoAcaoHoras: insulina.picoAcaoHoras ?? undefined,
      usuarioId: insulina.usuarioId,
    }));
  }

  async findOne(id: string): Promise<ListInsulinaDto> {
    const insulina = await this.insulinaRepository.findOneBy({ id });
    if (!insulina) {
      throw new NotFoundException(`Insulina com ID ${id} não encontrada`);
    }
    return {
      id: insulina.id,
      nome: insulina.nome,
      tipoBasalBolus: insulina.tipoBasalBolus,
      duracaoAcaoHoras: insulina.duracaoAcaoHoras,
      picoAcaoHoras: insulina.picoAcaoHoras ?? undefined,
      usuarioId: insulina.usuarioId,
    };
  }

  async update(id: string, updateInsulinaDto: UpdateInsulinaDto): Promise<ListInsulinaDto> {
    const insulina = await this.insulinaRepository.findOneBy({ id });
    if (!insulina) {
      throw new NotFoundException(`Insulina com ID ${id} não encontrada`);
    }
    await this.insulinaRepository.update(id, updateInsulinaDto);
    const insulinaAtualizada = await this.insulinaRepository.findOneBy({ id });
    if (!insulinaAtualizada) {
        throw new NotFoundException(`Insulina com ID ${id} não encontrada após a atualização`);
    }
     return {
      id: insulinaAtualizada.id,
      nome: insulinaAtualizada.nome,
      tipoBasalBolus: insulinaAtualizada.tipoBasalBolus,
      duracaoAcaoHoras: insulinaAtualizada.duracaoAcaoHoras,
      picoAcaoHoras: insulinaAtualizada.picoAcaoHoras ?? undefined,
      usuarioId: insulinaAtualizada.usuarioId,
    };
  }

  async remove(id: string): Promise<void> {
    const insulina = await this.insulinaRepository.findOneBy({ id });
    if (!insulina) {
      throw new NotFoundException(`Insulina com ID ${id} não encontrada`);
    }
    await this.insulinaRepository.delete(id);
  }
}