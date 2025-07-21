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

  /**
   * Cria uma nova insulina.
   * @param createInsulinaDto Dados para criação da insulina.
   * @returns Dados da insulina criada.
   */
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

  /**
   * Busca todas as insulinas de um usuário.
   * @param usuarioId ID do usuário.
   * @returns Lista de insulinas do usuário.
   */
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

  /**
   * Busca uma insulina pelo ID.
   * @param id ID da insulina.
   * @returns Dados da insulina encontrada.
   * @throws NotFoundException se a insulina não for encontrada.
   */
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

  /**
   * Atualiza uma insulina existente.
   * @param id ID da insulina.
   * @param updateInsulinaDto Dados para atualização.
   * @returns Dados da insulina atualizada.
   * @throws NotFoundException se a insulina não for encontrada.
   */
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

  /**
   * Remove uma insulina pelo ID.
   * @param id ID da insulina.
   * @throws NotFoundException se a insulina não for encontrada.
   */
  async remove(id: string): Promise<void> {
    const insulina = await this.insulinaRepository.findOneBy({ id });
    if (!insulina) {
      throw new NotFoundException(`Insulina com ID ${id} não encontrada`);
    }
    await this.insulinaRepository.delete(id);
  }
}