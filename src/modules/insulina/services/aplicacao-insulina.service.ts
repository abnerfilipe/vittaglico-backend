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
  ) {}

  async create(createAplicacaoInsulinaDto: CreateAplicacaoInsulinaDto): Promise<ListAplicacaoInsulinaDto> {
    const insulina = await this.insulinaService.findOne(createAplicacaoInsulinaDto.insulinaId);

    const aplicacaoInsulina = this.aplicacaoInsulinaRepository.create({
      ...createAplicacaoInsulinaDto,
      duracaoAcaoInsulinaEfetiva: insulina.duracaoAcaoHoras, // Garante que o valor seja preenchido
    });
    const savedAplicacaoInsulina = await this.aplicacaoInsulinaRepository.save(aplicacaoInsulina);

    if (!savedAplicacaoInsulina.insulinaId) {
      return {
        id: savedAplicacaoInsulina.id,
        quantidadeUnidades: savedAplicacaoInsulina.quantidadeUnidades,
        dataHoraAplicacao: savedAplicacaoInsulina.dataHoraAplicacao,
        usuarioId: savedAplicacaoInsulina.usuarioId,
        insulinaId: undefined,
        nome: undefined,
        tipoBasalBolus: undefined,
        duracaoAcaoHoras: undefined,
        picoAcaoHoras: undefined,
      };
    }

    return {
      id: savedAplicacaoInsulina.id,
      quantidadeUnidades: savedAplicacaoInsulina.quantidadeUnidades,
      dataHoraAplicacao: savedAplicacaoInsulina.dataHoraAplicacao,
      usuarioId: savedAplicacaoInsulina.usuarioId,
      insulinaId: savedAplicacaoInsulina.insulinaId ?? undefined,
      nome: insulina.nome,
      tipoBasalBolus: insulina.tipoBasalBolus,
      duracaoAcaoHoras: insulina.duracaoAcaoHoras,
      picoAcaoHoras: insulina.picoAcaoHoras ?? undefined,
    };
  }

  async findAll(usuarioId: string): Promise<ListAplicacaoInsulinaDto[]> {
    const aplicacoesInsulina = await this.aplicacaoInsulinaRepository.find({ where: { usuarioId } });
    return Promise.all(aplicacoesInsulina.map(async aplicacaoInsulina => {

      if (!aplicacaoInsulina.insulinaId) {
        return {
          id: aplicacaoInsulina.id,
          quantidadeUnidades: aplicacaoInsulina.quantidadeUnidades,
          dataHoraAplicacao: aplicacaoInsulina.dataHoraAplicacao,
          usuarioId: aplicacaoInsulina.usuarioId,
          insulinaId: undefined,
          nome: undefined,
          tipoBasalBolus: undefined,
          duracaoAcaoHoras: undefined,
          picoAcaoHoras: undefined,
        };
      }

      const insulina = await this.insulinaService.findOne(aplicacaoInsulina.insulinaId);
      return {
        id: aplicacaoInsulina.id,
        quantidadeUnidades: aplicacaoInsulina.quantidadeUnidades,
        dataHoraAplicacao: aplicacaoInsulina.dataHoraAplicacao,
        usuarioId: aplicacaoInsulina.usuarioId,
        insulinaId: aplicacaoInsulina.insulinaId ?? undefined,
        nome: insulina.nome,
        tipoBasalBolus: insulina.tipoBasalBolus,
        duracaoAcaoHoras: insulina.duracaoAcaoHoras,
        picoAcaoHoras: insulina.picoAcaoHoras ?? undefined,
      };
    }));
  }

  async findOne(id: string): Promise<ListAplicacaoInsulinaDto> {
    const aplicacaoInsulina = await this.aplicacaoInsulinaRepository.findOneBy({ id });
    if (!aplicacaoInsulina) {
      throw new NotFoundException(`Aplicação de insulina com ID ${id} não encontrada`);
    }

    if (!aplicacaoInsulina.insulinaId) {
      return {
        id: aplicacaoInsulina.id,
        quantidadeUnidades: aplicacaoInsulina.quantidadeUnidades,
        dataHoraAplicacao: aplicacaoInsulina.dataHoraAplicacao,
        usuarioId: aplicacaoInsulina.usuarioId,
        insulinaId: undefined,
        nome: undefined,
        tipoBasalBolus: undefined,
        duracaoAcaoHoras: undefined,
        picoAcaoHoras: undefined,
      };
    }

    const insulina = await this.insulinaService.findOne(aplicacaoInsulina.insulinaId);

    return {
      id: aplicacaoInsulina.id,
      quantidadeUnidades: aplicacaoInsulina.quantidadeUnidades,
      dataHoraAplicacao: aplicacaoInsulina.dataHoraAplicacao,
      usuarioId: aplicacaoInsulina.usuarioId,
      insulinaId: aplicacaoInsulina.insulinaId ?? undefined,
      nome: insulina.nome,
      tipoBasalBolus: insulina.tipoBasalBolus,
      duracaoAcaoHoras: insulina.duracaoAcaoHoras,
      picoAcaoHoras: insulina.picoAcaoHoras ?? undefined,
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

    if (!aplicacaoInsulinaAtualizada.insulinaId) {
       return {
        id: aplicacaoInsulinaAtualizada.id,
        quantidadeUnidades: aplicacaoInsulinaAtualizada.quantidadeUnidades,
        dataHoraAplicacao: aplicacaoInsulinaAtualizada.dataHoraAplicacao,
        usuarioId: aplicacaoInsulinaAtualizada.usuarioId,
        insulinaId: undefined,
        nome: undefined,
        tipoBasalBolus: undefined,
        duracaoAcaoHoras: undefined,
        picoAcaoHoras: undefined,
      };
    }

    const insulina = await this.insulinaService.findOne(aplicacaoInsulinaAtualizada.insulinaId);

    return {
      id: aplicacaoInsulinaAtualizada.id,
      quantidadeUnidades: aplicacaoInsulinaAtualizada.quantidadeUnidades,
      dataHoraAplicacao: aplicacaoInsulinaAtualizada.dataHoraAplicacao,
      usuarioId: aplicacaoInsulinaAtualizada.usuarioId,
      insulinaId: aplicacaoInsulinaAtualizada.insulinaId ?? undefined,
      nome: insulina.nome,
      tipoBasalBolus: insulina.tipoBasalBolus,
      duracaoAcaoHoras: insulina.duracaoAcaoHoras,
      picoAcaoHoras: insulina.picoAcaoHoras ?? undefined,
    };
  }

  async remove(id: string): Promise<void> {
    const aplicacaoInsulina = await this.aplicacaoInsulinaRepository.findOneBy({ id });
    if (!aplicacaoInsulina) {
      throw new NotFoundException(`Aplicação de insulina com ID ${id} não encontrada`);
    }
    await this.aplicacaoInsulinaRepository.delete(id);
  }
  async findAtivasByUsuarioId(usuarioId: string, dataHoraAtual: Date): Promise<AplicacaoInsulina[]> {
    return this.aplicacaoInsulinaRepository.find({
      where: {
        usuarioId,
        dataHoraAplicacao: MoreThanOrEqual(
          new Date(dataHoraAtual.getTime() - 6 * 60 * 60 * 1000).toISOString()
        ), // Últimas 6 horas
      },
      order: { dataHoraAplicacao: 'DESC' },
    });
  }
}