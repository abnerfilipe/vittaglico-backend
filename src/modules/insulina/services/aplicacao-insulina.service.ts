import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, type Repository } from "typeorm";
import type { CreateAplicacaoInsulinaDto } from "../dto/create-aplicacao-insulina.dto";
import type { ListAplicacaoInsulinaDto } from "../dto/list-aplicacao-insulina.dto";
import type { UpdateAplicacaoInsulinaDto } from "../dto/update-aplicacao-insulina.dto";
import { AplicacaoInsulina } from "../entities/aplicacao-insulina.entity";
import { InsulinaService } from "./insulina.service";

@Injectable()
export class AplicacaoInsulinaService {
  constructor(
    @InjectRepository(AplicacaoInsulina)
    private readonly aplicacaoInsulinaRepository: Repository<AplicacaoInsulina>,
    @Inject(InsulinaService)
    private readonly insulinaService: InsulinaService,
  ) { }

  /**
   * Cria uma nova aplicação de insulina.
   * @param createAplicacaoInsulinaDto Dados para criação da aplicação de insulina.
   * @returns Dados da aplicação de insulina criada.
   */
  async create(createAplicacaoInsulinaDto: CreateAplicacaoInsulinaDto): Promise<AplicacaoInsulina> {
    const insulina = await this.insulinaService.findOne(createAplicacaoInsulinaDto.insulinaId);

    const aplicacaoInsulina = this.aplicacaoInsulinaRepository.create({
      ...createAplicacaoInsulinaDto,
      duracaoAcaoInsulinaEfetiva: insulina.duracaoAcaoHoras,
    });
    return await this.aplicacaoInsulinaRepository.save(aplicacaoInsulina);
  }

  /**
   * Busca todas as aplicações de insulina de um usuário.
   * @param usuarioId ID do usuário.
   * @returns Lista de aplicações de insulina.
   */
  async findAll(usuarioId: string): Promise<AplicacaoInsulina[]> {
    return this.aplicacaoInsulinaRepository.find({ where: { usuarioId }, relations: ['insulinaAssociada'] });
  }

  /**
   * Busca uma aplicação de insulina pelo ID.
   * @param id ID da aplicação de insulina.
   * @returns Dados da aplicação de insulina.
   */
  async findOne(id: string): Promise<AplicacaoInsulina> {
    const aplicacaoInsulina = await this.aplicacaoInsulinaRepository.findOne({ where: { id }, relations: ['insulinaAssociada'] });
    if (!aplicacaoInsulina) {
      throw new NotFoundException(`Aplicação de insulina com ID ${id} não encontrada`);
    }
    return aplicacaoInsulina;
  }

  /**
   * Atualiza uma aplicação de insulina.
   * @param id ID da aplicação de insulina.
   * @param updateAplicacaoInsulinaDto Dados para atualização.
   * @returns Dados da aplicação de insulina atualizada.
   */
  async update(id: string, updateAplicacaoInsulinaDto: UpdateAplicacaoInsulinaDto): Promise<AplicacaoInsulina> {
    const aplicacaoInsulina = await this.aplicacaoInsulinaRepository.findOneBy({ id });
    if (!aplicacaoInsulina) {
      throw new NotFoundException(`Aplicação de insulina com ID ${id} não encontrada`);
    }
    await this.aplicacaoInsulinaRepository.update(id, updateAplicacaoInsulinaDto);
    const aplicacaoInsulinaAtualizada = await this.aplicacaoInsulinaRepository.findOneBy({ id });

    if (!aplicacaoInsulinaAtualizada) {
      throw new NotFoundException(`Aplicação de insulina com ID ${id} não encontrada após a atualização`);
    }

    return aplicacaoInsulinaAtualizada;
  }

  /**
   * Remove uma aplicação de insulina pelo ID.
   * @param id ID da aplicação de insulina.
   */
  async remove(id: string): Promise<void> {
    const aplicacaoInsulina = await this.aplicacaoInsulinaRepository.findOneBy({ id });
    if (!aplicacaoInsulina) {
      throw new NotFoundException(`Aplicação de insulina com ID ${id} não encontrada`);
    }
    await this.aplicacaoInsulinaRepository.delete(id);
  }

  /**
   * Busca aplicações de insulina ativas de um usuário nas últimas 6 horas.
   * @param usuarioId ID do usuário.
   * @param dataHoraAtual Data e hora atual para referência.
   * @returns Lista de aplicações de insulina ativas.
   */
  async findAtivasByUsuarioId(usuarioId: string, dataHoraAtual: Date): Promise<AplicacaoInsulina[]> {
    return this.aplicacaoInsulinaRepository.find({
      where: {
        usuarioId,
        dataHoraAplicacao: MoreThanOrEqual(
          new Date(dataHoraAtual.getTime() - 6 * 60 * 60 * 1000).toISOString()
        ),
      },
      order: { dataHoraAplicacao: 'DESC' },
    });
  }

}